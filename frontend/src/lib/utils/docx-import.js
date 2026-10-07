import { uploadsApi } from '@/lib/api/uploads-client'

// Vercel rejects request bodies over 4.5 MB, so a large photo pasted into Word
// is shrunk in the browser before upload. The backend compresses it again.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const MAX_IMAGE_EDGE = 2400
const EXCERPT_LENGTH = 260

/** Downscale an image blob to JPEG when it is too big to upload. */
async function shrinkIfNeeded(blob) {
  if (blob.size <= MAX_IMAGE_BYTES) return blob
  const bitmap = await createImageBitmap(blob)
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext('2d')
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
}

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

/**
 * Convert a Word (.docx) article into the fields of a news item. Every embedded
 * image is uploaded to the image library and linked by URL, so the article body
 * keeps all its photos and captions in their original order.
 *
 * @param {File} file
 * @param {{onProgress?: (message: string) => void, takeCover?: boolean}} [options]
 *   `takeCover`: use the first image as the cover; when it sits at the very top
 *   it is dropped from the body, since the page already shows the cover there.
 * @returns {Promise<{title: string, excerpt: string, content: string,
 *                    cover: object|null, imageCount: number}>}
 */
export async function importDocx(file, { onProgress = () => {}, takeCover = false } = {}) {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()

  // Images may convert concurrently; the index taken up front keeps their order.
  const uploaded = []
  let imageCount = 0
  const convertImage = mammoth.images.imgElement(async (image) => {
    const index = imageCount++
    onProgress(`Đang tải ảnh ${index + 1} lên…`)
    const raw = await image.read()
    const blob = await shrinkIfNeeded(new Blob([raw], { type: image.contentType }))
    const extension = blob.type.split('/')[1] || 'jpg'
    const result = await uploadsApi.uploadImage(
      new File([blob], `bai-viet-${index + 1}.${extension}`, { type: blob.type }),
    )
    uploaded[index] = result
    return { src: result.url }
  })

  onProgress('Đang đọc file…')
  const { value: html } = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      convertImage,
      // Word styles that should not turn into a page-level <h1>.
      styleMap: ['p[style-name="Title"] => h1:fresh', 'p[style-name="Subtitle"] => h2:fresh'],
    },
  )

  const root = document.createElement('div')
  root.innerHTML = html

  // Empty paragraphs are how Word users add spacing; they show as gaps on the web.
  root.querySelectorAll('p').forEach((node) => {
    if (!node.textContent.trim() && !node.querySelector('img')) node.remove()
  })

  // The heading at the top is the article title, which the page already prints.
  // Many authors just type it as a bold first line instead of using a style.
  let title = ''
  const firstBlock = root.firstElementChild
  if (firstBlock && (firstBlock.tagName === 'H1' || isBoldLine(firstBlock))) {
    title = firstBlock.textContent.replace(/\s+/g, ' ').trim()
    firstBlock.remove()
  }
  // Remaining <h1>s would compete with the page title.
  root.querySelectorAll('h1').forEach((node) => {
    const h2 = document.createElement('h2')
    h2.innerHTML = node.innerHTML
    node.replaceWith(h2)
  })

  const firstImage = takeCover ? uploaded[0] : null
  const cover = firstImage ? { url: firstImage.url, thumb: firstImage.thumb, alt: title } : null
  const leadBlock = root.firstElementChild
  if (cover && leadBlock?.tagName === 'P' && !leadBlock.textContent.trim()) {
    const images = leadBlock.querySelectorAll('img')
    if (images.length === 1 && images[0].getAttribute('src') === cover.url) leadBlock.remove()
  }

  return {
    title,
    excerpt: buildExcerpt(root),
    content: root.innerHTML,
    cover,
    imageCount,
  }
}
