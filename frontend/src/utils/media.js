/**
 * Chọn URL ảnh phù hợp với ngữ cảnh.
 *
 * Backend sinh sẵn bản thu nhỏ (cạnh dài ≤ 480px) cho ảnh lớn. Danh sách và thẻ
 * dùng bản thu nhỏ; trang chi tiết dùng bản đầy đủ. Ảnh nhỏ không có bản thu nhỏ
 * nên luôn phải có đường lùi về `url`.
 */
export function thumbUrl(media) {
  return media?.thumb || media?.url || null
}

export function fullUrl(media) {
  return media?.url || null
}
