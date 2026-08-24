/** Định dạng số tiền VNĐ đầy đủ, ví dụ 45.103.262.902 */
export function formatVnd(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('vi-VN').format(value)
}

/** Quy đổi sang tỷ đồng, giữ 1 chữ số thập phân — ví dụ 45,1 */
export function formatBillion(value) {
  if (value == null) return '—'
  return (value / 1_000_000_000).toLocaleString('vi-VN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}
