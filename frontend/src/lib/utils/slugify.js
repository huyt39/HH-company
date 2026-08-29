/**
 * Turn accented Vietnamese into a slug.
 * @example slugify('Cầu Móng Sến') // "cau-mong-sen"
 */
export function slugify(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}
