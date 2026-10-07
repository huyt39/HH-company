import { extractPdfBlocks } from './pdf-blocks'

// Matches pdfjs `ImageKind`.
const GRAYSCALE_1BPP = 1
const RGB_24BPP = 2

/** pdf.js decoded image data -> RGBA pixels. */
function toImageData(image) {
  const { width, height, kind, data } = image
  const pixels = new ImageData(width, height)
  const out = pixels.data

  if (kind === GRAYSCALE_1BPP) {
    const rowBytes = Math.ceil(width / 8)
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const on = data[y * rowBytes + (x >> 3)] & (128 >> (x & 7))
        const offset = (y * width + x) * 4
        out[offset] = out[offset + 1] = out[offset + 2] = on ? 255 : 0
        out[offset + 3] = 255
      }
    }
  } else if (kind === RGB_24BPP) {
    for (let src = 0, dst = 0; dst < out.length; src += 3, dst += 4) {
      out[dst] = data[src]
      out[dst + 1] = data[src + 1]
      out[dst + 2] = data[src + 2]
      out[dst + 3] = 255
    }
  } else {
    out.set(data.subarray(0, out.length))
  }
  return pixels
}

/** Encode a decoded PDF image as JPEG on a white background. */
async function imageToBlob(image) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext('2d')
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (image.bitmap) {
    context.drawImage(image.bitmap, 0, 0)
  } else {
    // putImageData overwrites instead of blending, so go through a second canvas.
    const layer = document.createElement('canvas')
    layer.width = image.width
    layer.height = image.height
    layer.getContext('2d').putImageData(toImageData(image), 0, 0)
    context.drawImage(layer, 0, 0)
  }
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
}

/**
 * PDF -> article HTML. Images point at temporary `blob:` URLs; the caller
 * uploads them and swaps in the real URLs.
 *
 * @param {File} file
 * @param {(message: string) => void} onProgress
 * @returns {Promise<{html: string, textLength: number}>}
 */
export async function pdfToHtml(file, onProgress) {
  const [pdfjs, { default: workerUrl }] = await Promise.all([
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

  const { blocks, textLength, cleanup } = await extractPdfBlocks(
    pdfjs,
    new Uint8Array(await file.arrayBuffer()),
    { onPage: (page, total) => onProgress(`Đang đọc trang ${page}/${total}…`) },
  )

  try {
    const parts = []
    for (const block of blocks) {
      if (block.type === 'heading') parts.push(`<h${block.level}>${block.html}</h${block.level}>`)
      else if (block.type === 'paragraph') parts.push(`<p>${block.html}</p>`)
      else if (block.type === 'list') parts.push(`<ul>${block.items.map((item) => `<li>${item}</li>`).join('')}</ul>`)
      else {
        const blob = await imageToBlob(block.image)
        if (blob) parts.push(`<p><img src="${URL.createObjectURL(blob)}" alt="" /></p>`)
      }
    }
    return { html: parts.join(''), textLength }
  } finally {
    cleanup()
  }
}
