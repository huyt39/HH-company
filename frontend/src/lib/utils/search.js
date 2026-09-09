/**
 * Strip Vietnamese diacritics and lowercase, so search ignores accents:
 * "cap du ung luc" finds "Cáp dự ứng lực".
 */
export function normalize(text) {
  return (text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
}
