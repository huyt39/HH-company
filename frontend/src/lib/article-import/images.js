import { uploadsApi } from '@/lib/api/uploads-client'

// Vercel rejects request bodies over 4.5 MB, so a large photo is shrunk in the
// browser before upload. The backend compresses it again.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const MAX_IMAGE_EDGE = 2400
const UPLOADABLE = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

/** Re-encode as JPEG: shrinks big photos and converts formats the server refuses (BMP, TIFF…). */
async function reencode(blob) {
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

/** A blob the server accepts, or null when the browser cannot decode it (EMF/WMF). */
async function prepare(blob) {
  if (UPLOADABLE.has(blob.type) && blob.size <= MAX_IMAGE_BYTES) return blob
  try {
    return await reencode(blob)
  } catch {
    return null
  }
}

async function uploadWithRetry(file) {
  try {
    return await uploadsApi.uploadImage(file)
  } catch (err) {
    // One retry for a dropped connection; a 4xx answer will not change.
    if (err.status && err.status < 500) throw err
    return uploadsApi.uploadImage(file)
  }
}

/**
 * Upload every `<img>` under `root` (data: or blob: URLs) to the image library
 * and point it at the stored URL. Stops with a clear error on the first failed
 * upload instead of leaving the article silently missing photos.
 *
 * @param {HTMLElement} root
 * @param {(message: string) => void} onProgress
 * @returns {Promise<{uploaded: object[], skipped: number}>}
 */
export async function uploadImages(root, onProgress) {
  const images = [...root.querySelectorAll('img')]
  const uploaded = []
  let skipped = 0

  for (const [index, img] of images.entries()) {
    const label = `${index + 1}/${images.length}`
    onProgress(`Đang tải ảnh ${label} lên…`)

    const source = img.getAttribute('src') || ''
    const original = await fetch(source).then((res) => res.blob())
    if (source.startsWith('blob:')) URL.revokeObjectURL(source)

    const blob = await prepare(original)
    if (!blob) {
      // Vector formats from Office drawings; nothing a browser can show anyway.
      const holder = img.closest('p')
      if (holder && !holder.textContent.trim() && holder.querySelectorAll('img').length === 1) holder.remove()
      else img.remove()
      skipped += 1
      continue
    }

    const extension = blob.type.split('/')[1] || 'jpg'
    try {
      const result = await uploadWithRetry(
        new File([blob], `bai-viet-${index + 1}.${extension}`, { type: blob.type }),
      )
      img.setAttribute('src', result.url)
      img.removeAttribute('width')
      img.removeAttribute('height')
      uploaded.push(result)
    } catch (err) {
      throw new Error(
        `Không tải được ảnh thứ ${label} lên máy chủ: ${err.message}. ` +
          'Nội dung chưa được điền vào form — kiểm tra kết nối / đăng nhập lại rồi thử lại.',
      )
    }
  }

  return { uploaded, skipped }
}
