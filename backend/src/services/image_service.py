"""Image processing before storage: detect format, fix orientation, strip
metadata, downscale, compress and build a thumbnail.

Three reasons not to store the original as-is:

1. Privacy — phone photos carry EXIF, often including GPS coordinates.
2. Orientation — portrait photos ship an Orientation flag that older browsers
   ignore, so the image must be rotated for real before EXIF is dropped.
3. Size — a multi-megabyte 4000px photo makes the page crawl.
"""

import io
from dataclasses import dataclass

from PIL import Image, ImageOps

# Longest-edge caps. 1600px covers a full-width image on a 2x display.
MAX_FULL_EDGE = 1600
MAX_THUMB_EDGE = 480

# Capping only the long edge ruins panoramas: a 3:1 photo capped at 480px wide
# leaves a 160px short edge, and a card that crops to 16:10 then has to blow it
# back up. Hold the short edge at card height instead.
MIN_THUMB_SHORT_EDGE = 400

# Below this the second file stops paying for itself — the card may as well load
# the full image, which is sharper.
THUMB_WORTH_KEEPING_RATIO = 0.6

JPEG_QUALITY_FULL = 82
JPEG_QUALITY_THUMB = 78

# Re-compressing an already small file only costs quality.
SKIP_THUMB_IF_UNDER_BYTES = 40 * 1024

# Only downscale when the image is meaningfully over the cap: 1652px to 1600px
# saves nothing, and re-encoding an already compressed source inflates it.
RESIZE_TOLERANCE = 1.15

# Common web formats only — SVG is rejected because it can carry script.
ALLOWED_KINDS = ("jpeg", "png", "gif", "webp")

CONTENT_TYPES = {
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
}


@dataclass
class ProcessedImage:
    full: bytes
    thumb: bytes | None
    width: int
    height: int
    extension: str
    original_size: int

    @property
    def content_type(self) -> str:
        return CONTENT_TYPES.get(self.extension, "image/jpeg")

    @property
    def saved_percent(self) -> int:
        if not self.original_size:
            return 0
        return round((1 - len(self.full) / self.original_size) * 100)


def detect_kind(data: bytes) -> str | None:
    """Detect the format from magic bytes; never trust the client extension."""
    if data[:3] == b"\xff\xd8\xff":
        return "jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "gif"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return None


def _is_animated(image: Image.Image) -> bool:
    return getattr(image, "n_frames", 1) > 1


def _encode(image: Image.Image, kind: str, quality: int) -> tuple[bytes, str]:
    """Write the image to bytes with no metadata attached."""
    buffer = io.BytesIO()

    if kind == "png":
        image.save(buffer, format="PNG", optimize=True)
        return buffer.getvalue(), ".png"

    if kind == "webp":
        image.save(buffer, format="WEBP", quality=quality, method=6)
        return buffer.getvalue(), ".webp"

    # JPEG has no alpha channel — flatten transparency onto white.
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
    """Downscale keeping the aspect ratio. Never upscale a smaller image."""
    if max(image.size) <= max_edge * tolerance:
        return image.copy()
    resized = image.copy()
    resized.thumbnail((max_edge, max_edge), Image.LANCZOS)
    return resized


def _thumb_scale(width: int, height: int) -> float:
    """How far to shrink for a thumbnail: long edge under the cap, but never a
    short edge too small for the card that crops it."""
    by_long_edge = MAX_THUMB_EDGE / max(width, height)
    by_short_edge = MIN_THUMB_SHORT_EDGE / min(width, height)
    return min(1.0, max(by_long_edge, min(1.0, by_short_edge)))


def process(data: bytes, kind: str, *, make_thumb: bool = True) -> ProcessedImage:
    """Process one image. `kind` is the detected format: jpeg | png | gif | webp."""
    original_size = len(data)

    with Image.open(io.BytesIO(data)) as opened:
        # Animated GIF: resizing would drop the animation, so keep the original.
        if kind == "gif" and _is_animated(opened):
            return ProcessedImage(
                full=data,
                thumb=None,
                width=opened.width,
                height=opened.height,
                extension=".gif",
                original_size=original_size,
            )

        # exif_transpose rotates by the Orientation flag, then clears the flag.
        image = ImageOps.exif_transpose(opened)
        # Rebuilding from raw pixels is the surest way to drop every metadata block.
        image = image.convert(image.mode)

    target_kind = "png" if kind in ("png", "gif") else kind
    full_image = _resize(image, MAX_FULL_EDGE, RESIZE_TOLERANCE)
    full_bytes, extension = _encode(full_image, target_kind, JPEG_QUALITY_FULL)

    # If processing made it bigger, keep the original — happens with sources
    # that were already compressed hard, where re-encoding only adds noise.
    if len(full_bytes) >= original_size and kind == target_kind:
        full_bytes = data
        full_image = image

    thumb_bytes = None
    if make_thumb and original_size > SKIP_THUMB_IF_UNDER_BYTES:
        scale = _thumb_scale(full_image.width, full_image.height)
        target = (round(full_image.width * scale), round(full_image.height * scale))
        if target != full_image.size:
            thumb_image = full_image.resize(target, Image.LANCZOS)
            candidate, _ = _encode(thumb_image, target_kind, JPEG_QUALITY_THUMB)
            # A thumbnail only earns its place if it saves real bytes.
            if len(candidate) < len(full_bytes) * THUMB_WORTH_KEEPING_RATIO:
                thumb_bytes = candidate

    return ProcessedImage(
        full=full_bytes,
        thumb=thumb_bytes,
        width=full_image.width,
        height=full_image.height,
        extension=extension,
        original_size=original_size,
    )
