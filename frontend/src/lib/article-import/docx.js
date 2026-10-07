/**
 * Word (.docx) -> article HTML. Images come out as `data:` URLs; the caller
 * uploads them and swaps in the real URLs.
 *
 * @param {File} file
 * @returns {Promise<{html: string}>}
 */
export async function docxToHtml(file) {
  const mammoth = await import('mammoth')
  const { value } = await mammoth.convertToHtml(
    { arrayBuffer: await file.arrayBuffer() },
    // Word styles that should not turn into a page-level <h1>.
    { styleMap: ['p[style-name="Title"] => h1:fresh', 'p[style-name="Subtitle"] => h2:fresh'] },
  )
  return { html: value }
}
