"""Xử lý ảnh trước khi lưu: sửa hướng, xoá metadata, thu nhỏ, nén, tạo thumbnail.

Ba lý do phải xử lý chứ không lưu nguyên bản:

1. **Quyền riêng tư** — ảnh chụp từ điện thoại nhúng EXIF, thường có cả toạ độ GPS
   và model máy. Đưa nguyên lên web công khai là để lộ vị trí chụp.
2. **Hướng ảnh** — ảnh dọc từ điện thoại lưu kèm cờ Orientation; trình duyệt cũ
   hiển thị nằm ngang. Phải xoay thật rồi mới xoá EXIF.
3. **Dung lượng** — ảnh gốc 4000px vài MB làm trang tải rất chậm.
"""

import io
from dataclasses import dataclass

from PIL import Image, ImageOps

# Giới hạn cạnh dài nhất. 1600px đủ cho ảnh full-width trên màn hình 2x.
MAX_FULL_EDGE = 1600
MAX_THUMB_EDGE = 480

JPEG_QUALITY_FULL = 82
JPEG_QUALITY_THUMB = 78

# Ngưỡng bỏ qua: ảnh đã nhỏ và nhẹ thì nén lại chỉ làm giảm chất lượng.
SKIP_IF_UNDER_BYTES = 40 * 1024

# Chỉ thu nhỏ khi ảnh vượt giới hạn đáng kể. Ảnh 1652px thu về 1600px gần như
# không tiết kiệm được gì, mà tái mã hoá từ nguồn đã nén lại làm file phình ra.
RESIZE_TOLERANCE = 1.15


@dataclass
class ProcessedImage:
    full: bytes
    thumb: bytes | None
    width: int
    height: int
    extension: str
    original_size: int

    @property
    def saved_percent(self) -> int:
        if not self.original_size:
            return 0
        return round((1 - len(self.full) / self.original_size) * 100)


def _is_animated(image: Image.Image) -> bool:
    return getattr(image, "n_frames", 1) > 1


def _encode(image: Image.Image, kind: str, quality: int) -> tuple[bytes, str]:
    """Ghi ảnh ra bytes, không kèm bất kỳ metadata nào."""
    buffer = io.BytesIO()

    if kind == "png":
        image.save(buffer, format="PNG", optimize=True)
        return buffer.getvalue(), ".png"

    if kind == "webp":
        image.save(buffer, format="WEBP", quality=quality, method=6)
        return buffer.getvalue(), ".webp"

    # JPEG không hỗ trợ alpha — ghép nền trắng nếu ảnh có kênh trong suốt.
    if image.mode in ("RGBA", "LA", "P"):
        image = image.convert("RGBA")
        background = Image.new("RGB", image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[-1])
        image = background
    elif image.mode != "RGB":
        image = image.convert("RGB")

    image.save(buffer, format="JPEG", quality=quality, optimize=True, progressive=True)
    return buffer.getvalue(), ".jpg"


def _resize(image: Image.Image, max_edge: int, tolerance: float = 1.0) -> Image.Image:
    """Thu nhỏ giữ tỉ lệ. Không phóng to ảnh vốn đã nhỏ hơn giới hạn."""
    if max(image.size) <= max_edge * tolerance:
        return image.copy()
    resized = image.copy()
    resized.thumbnail((max_edge, max_edge), Image.LANCZOS)
    return resized


def process(data: bytes, kind: str, *, make_thumb: bool = True) -> ProcessedImage:
    """Xử lý một ảnh. `kind` là loại đã nhận dạng: jpeg | png | gif | webp."""
    original_size = len(data)

    with Image.open(io.BytesIO(data)) as opened:
        # GIF động: resize sẽ mất animation, giữ nguyên bản.
        if kind == "gif" and _is_animated(opened):
            return ProcessedImage(
                full=data, thumb=None,
                width=opened.width, height=opened.height,
                extension=".gif", original_size=original_size,
            )

        # exif_transpose xoay ảnh theo cờ Orientation rồi bỏ cờ đó đi.
        image = ImageOps.exif_transpose(opened)
        # Tạo ảnh mới từ pixel thuần — cách chắc chắn nhất để không sót metadata.
        image = image.convert(image.mode)

    target_kind = "png" if kind in ("png", "gif") else kind
    full_image = _resize(image, MAX_FULL_EDGE, RESIZE_TOLERANCE)
    full_bytes, extension = _encode(full_image, target_kind, JPEG_QUALITY_FULL)

    # Nếu xử lý xong lại nặng hơn bản gốc thì giữ nguyên bản gốc — chuyện này xảy
    # ra khi nguồn đã được nén mạnh, tái mã hoá chỉ thêm nhiễu và thêm dung lượng.
    # Vẫn giữ được lợi ích chính là xoá metadata nếu bản gốc không có metadata.
    if len(full_bytes) >= original_size and kind == target_kind:
        full_bytes = data
        full_image = image

    thumb_bytes = None
    if make_thumb and original_size > SKIP_IF_UNDER_BYTES:
        thumb_image = _resize(image, MAX_THUMB_EDGE)
        if thumb_image.size != full_image.size:
            candidate, _ = _encode(thumb_image, target_kind, JPEG_QUALITY_THUMB)
            # Thumbnail chỉ có ý nghĩa nếu thực sự nhẹ hơn ảnh đầy đủ.
            if len(candidate) < len(full_bytes):
                thumb_bytes = candidate

    return ProcessedImage(
        full=full_bytes,
        thumb=thumb_bytes,
        width=full_image.width,
        height=full_image.height,
        extension=extension,
        original_size=original_size,
    )
