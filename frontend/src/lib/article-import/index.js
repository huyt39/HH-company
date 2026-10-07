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

/**
 * Title: the document's own title line when it opens with one (Word's Title or
 * Heading 1 style, a PDF's large first line) — lifted out because the page
 * prints the title above the body. Anything else stays exactly as written.
 */
function takeTitle(root) {
  const first = root.firstElementChild
  if (first?.tagName !== 'H1' || !first.textContent.trim()) return ''
  first.remove()
  return first.textContent.replace(/\s+/g, ' ').trim()
}

/** "THƯ NGỎ TUYỂN DỤNG- Đại học xây dựng (1).docx" -> "THƯ NGỎ TUYỂN DỤNG - Đại học xây dựng" */
function titleFromFileName(name) {
  return name
    .replace(/\.[^.]+$/, '') // extension
    .replace(/\s*\(\d+\)$/, '') // the " (1)" a browser adds to a repeated download
    .replace(/_+/g, ' ')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim()
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

  // No title line in the file: the file name tells two uploads apart.
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
