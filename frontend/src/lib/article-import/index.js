import { docxToHtml } from './docx'
import { uploadImages } from './images'
import { pdfToHtml } from './pdf'

const EXCERPT_LENGTH = 260

export const ACCEPTED_EXTENSIONS = ['.docx', '.pdf']

/** Text of the first real paragraph, cut at a word boundary. */
function buildExcerpt(root) {
  const paragraph = [...root.querySelectorAll('p')]
    .map((node) => node.textContent.replace(/\s+/g, ' ').trim())
    .find((text) => text.length > 40)
  if (!paragraph) return ''
  if (paragraph.length <= EXCERPT_LENGTH) return paragraph
  return `${paragraph.slice(0, EXCERPT_LENGTH).replace(/\s+\S*$/, '')}…`
}

/** A short paragraph written entirely in bold — reads as a hand-made heading. */
function isBoldLine(node) {
  if (node.tagName !== 'P') return false
  const text = node.textContent.trim()
  if (!text || text.length > 200) return false
  const boldText = [...node.querySelectorAll('strong')].map((el) => el.textContent).join('').trim()
  return boldText.replace(/\s+/g, '') === text.replace(/\s+/g, '')
}

// How many blocks from the top to search for a title.
const TITLE_SEARCH_BLOCKS = 8

const isHeading = (node) => /^H[1-3]$/.test(node.tagName) && node.textContent.trim()
const isImageOnly = (node) => node.querySelector('img') && !node.textContent.trim()

/**
 * Find the title near the top. Letters and job ads often open with a letterhead
 * (a table with the logo and address) or a photo, so those are stepped over.
 * The title is lifted out of the body only when it opens the document — the
 * page prints it there already; further down it stays where the author put it.
 */
function takeTitle(root) {
  const blocks = [...root.children].slice(0, TITLE_SEARCH_BLOCKS)
  for (const [index, block] of blocks.entries()) {
    if (block.tagName === 'TABLE' || isImageOnly(block) || !block.textContent.trim()) continue
    if (!isHeading(block) && !isBoldLine(block)) continue
    const title = block.textContent.replace(/\s+/g, ' ').trim()
    if (index === 0) block.remove()
    return title
  }
  return ''
}

/** "thu-ngo_tuyen dung 2026.docx" -> "thu ngo tuyen dung 2026" */
function titleFromFileName(name) {
  return name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function fileKind(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.docx')) return 'docx'
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.doc')) {
    throw new Error('File .doc đời cũ chưa đọc được. Mở file bằng Word, chọn "Lưu thành" (Save As) → định dạng .docx rồi tải lại.')
  }
  throw new Error('Chỉ nhận file Word (.docx) hoặc PDF.')
}

/**
 * Convert a Word or PDF article into the fields of a news item. Every image is
 * uploaded to the image library first, so the body keeps all photos and
 * captions in their original order.
 *
 * @param {File} file
 * @param {{onProgress?: (message: string) => void, takeCover?: boolean}} [options]
 *   `takeCover`: use the first image as the cover. It stays in the body too, with
 *   its caption; the article page skips a cover that the body already shows.
 * @returns {Promise<{title: string, excerpt: string, content: string, cover: object|null,
 *                    imageCount: number, warnings: string[]}>}
 */
export async function importArticleFile(file, { onProgress = () => {}, takeCover = false } = {}) {
  const kind = fileKind(file)
  const warnings = []

  onProgress('Đang đọc file…')
  const parsed = kind === 'pdf' ? await pdfToHtml(file, onProgress) : await docxToHtml(file)

  const root = document.createElement('div')
  root.innerHTML = parsed.html

  // Empty paragraphs are how Word users add spacing; they show as gaps on the web.
  root.querySelectorAll('p').forEach((node) => {
    if (!node.textContent.trim() && !node.querySelector('img')) node.remove()
  })

  // A form cannot save without a title, so fall back to the file name.
  const title = takeTitle(root) || titleFromFileName(file.name)
  // Remaining <h1>s would compete with the page title.
  root.querySelectorAll('h1').forEach((node) => {
    const h2 = document.createElement('h2')
    h2.innerHTML = node.innerHTML
    node.replaceWith(h2)
  })

  const { uploaded, skipped } = await uploadImages(root, onProgress)
  if (skipped) warnings.push(`Bỏ qua ${skipped} hình vẽ dạng EMF/WMF mà trình duyệt không hiển thị được.`)
  if (kind === 'pdf' && parsed.textLength < 50 && uploaded.length) {
    warnings.push('PDF này là ảnh scan, không có chữ — chỉ lấy được ảnh. Nên dùng file Word gốc.')
  }

  const firstImage = takeCover ? uploaded[0] : null
  const cover = firstImage ? { url: firstImage.url, thumb: firstImage.thumb, alt: title } : null

  return {
    title,
    excerpt: buildExcerpt(root),
    content: root.innerHTML,
    cover,
    imageCount: uploaded.length,
    warnings,
  }
}
