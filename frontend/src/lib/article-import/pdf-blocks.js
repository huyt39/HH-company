/**
 * Turn a PDF into an ordered list of article blocks (headings, paragraphs,
 * bullet lists, images).
 *
 * A PDF only knows where each glyph and picture is drawn, not what is a
 * paragraph, so the structure is rebuilt from geometry: items on one baseline
 * form a line, lines close together form a paragraph, larger text is a heading,
 * and pictures slot in between by their vertical position on the page.
 *
 * DOM-free on purpose, so it can be tested under Node; turning image data into
 * files happens in `pdf.js`.
 */

// A gap between lines wider than this many font sizes starts a new paragraph.
const PARAGRAPH_GAP = 1.6
// Text this much larger than body text is a heading.
const HEADING_RATIO = 1.2
const HEADING_MAX_CHARS = 200
// Pictures smaller than this (decoded pixels) are icons, rules or bullets.
const MIN_IMAGE_EDGE = 100

const BULLET = /^\s*[•●▪■◦·‣\-–—+*]\s+/
const PAGE_NUMBER = /^\s*(trang|page)?\s*\d+(\s*(\/|of|trên)\s*\d+)?\s*$/i
const SENTENCE_END = /[.!?:;…”"»)]\s*$/

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Bold / italic from the embedded font name, e.g. "ABCDEF+Arial-BoldItalicMT". */
function fontStyleOf(page, fontName, cache) {
  if (cache.has(fontName)) return cache.get(fontName)
  let style = { bold: false, italic: false }
  try {
    const font = page.commonObjs.get(fontName)
    const name = `${font?.name ?? ''} ${font?.fallbackName ?? ''}`
    style = {
      bold: Boolean(font?.bold || font?.black) || /bold|black|heavy|semibold|demi/i.test(name),
      italic: Boolean(font?.italic) || /italic|oblique/i.test(name),
    }
  } catch {
    /* font not loaded — treat as regular */
  }
  cache.set(fontName, style)
  return style
}

/** Group text items into visual lines, keeping bold/italic runs. */
function buildLines(items, styleOf) {
  const lines = []
  let line = null

  for (const item of items) {
    if (item.str) {
      const [, , c, d, x, y] = item.transform
      const size = Math.hypot(c, d) || item.height || 10
      const sameLine = line && Math.abs(y - line.y) <= size * 0.5 && x >= line.right - size

      if (!sameLine) {
        line = { y, x, right: x, size, runs: [] }
        lines.push(line)
      } else if (x - line.right > size * 0.15 && !/\s$/.test(line.runs.at(-1)?.text ?? '') && !/^\s/.test(item.str)) {
        line.runs.push({ text: ' ', bold: false, italic: false })
      }

      line.runs.push({ text: item.str, ...styleOf(item.fontName) })
      line.right = Math.max(line.right, x + item.width)
      line.size = Math.max(line.size, size)
    }
    if (item.hasEOL) line = null
  }

  for (const entry of lines) {
    entry.text = entry.runs.map((run) => run.text).join('').replace(/\s+/g, ' ').trim()
  }
  return lines.filter((entry) => entry.text)
}

/** Runs -> inline HTML, merging neighbours that share a style. */
function runsToHtml(runs) {
  const merged = []
  for (const run of runs) {
    const last = merged[merged.length - 1]
    // Spaces take the style of whatever they sit next to.
    if (last && (last.bold === run.bold && last.italic === run.italic || !run.text.trim())) {
      last.text += run.text
    } else {
      merged.push({ ...run })
    }
  }
  return merged
    .map(({ text, bold, italic }) => {
      let html = escapeHtml(text.replace(/\s+/g, ' '))
      if (!text.trim()) return html
      if (italic) html = `<em>${html}</em>`
      if (bold) html = `<strong>${html}</strong>`
      return html
    })
    .join('')
    .trim()
}

/** Lines -> paragraphs, splitting on wide gaps, size changes and bullets. */
function buildParagraphs(lines, pageRight) {
  const paragraphs = []
  let para = null

  for (const line of lines) {
    const prev = para?.lines[para.lines.length - 1]
    const gap = prev ? prev.y - line.y : 0
    const startsNew =
      !para ||
      Math.abs(line.size - para.size) > para.size * 0.15 ||
      gap > PARAGRAPH_GAP * line.size ||
      gap < -line.size || // jumped up: next column
      BULLET.test(line.text) ||
      // A short line ending a sentence closes its paragraph (justified text).
      (SENTENCE_END.test(prev.text) && prev.right < pageRight - line.size * 3)

    if (startsNew) {
      para = { lines: [], size: line.size }
      paragraphs.push(para)
    }
    para.lines.push(line)
  }

  return paragraphs.map((entry) => {
    const runs = []
    entry.lines.forEach((line, index) => {
      if (index > 0) runs.push({ text: ' ', bold: false, italic: false })
      runs.push(...line.runs)
    })
    const text = entry.lines.map((line) => line.text).join(' ')
    const textRuns = runs.filter((run) => run.text.trim())
    return {
      type: 'text',
      top: entry.lines[0].y + entry.size,
      size: entry.size,
      text,
      runs,
      bold: textRuns.length > 0 && textRuns.every((run) => run.bold),
      bullet: BULLET.test(text),
    }
  })
}

/** Where each picture is drawn, from the operator list's transform stack. */
function locateImages(pdfjs, opList) {
  const { OPS, Util } = pdfjs
  const found = []
  const stack = []
  let ctm = [1, 0, 0, 1, 0, 0]

  opList.fnArray.forEach((fn, index) => {
    const args = opList.argsArray[index]
    switch (fn) {
      case OPS.save:
        stack.push(ctm)
        break
      case OPS.restore:
        ctm = stack.pop() ?? ctm
        break
      case OPS.transform:
        ctm = Util.transform(ctm, args)
        break
      case OPS.paintFormXObjectBegin:
        stack.push(ctm)
        if (Array.isArray(args?.[0]) && args[0].length === 6) ctm = Util.transform(ctm, args[0])
        break
      case OPS.paintFormXObjectEnd:
        ctm = stack.pop() ?? ctm
        break
      case OPS.paintImageXObject:
      case OPS.paintInlineImageXObject: {
        const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map((p) => Util.applyTransform(p, ctm))
        const ys = corners.map((p) => p[1])
        const entry = { top: Math.max(...ys), height: Math.max(...ys) - Math.min(...ys) }
        if (fn === OPS.paintImageXObject) entry.id = args[0]
        else entry.inline = args[0]
        found.push(entry)
        break
      }
      default:
    }
  })
  return found
}

function loadObject(page, id) {
  const store = id.startsWith('g_') ? page.commonObjs : page.objs
  return new Promise((resolve) => {
    try {
      store.get(id, resolve)
    } catch {
      resolve(null)
    }
  })
}

/** Lines repeated at the same height on several pages: running headers/footers. */
function findRepeatedLines(pages) {
  if (pages.length < 3) return new Set()
  const counts = new Map()
  for (const page of pages) {
    const seen = new Set()
    for (const line of page.lines) {
      const key = `${Math.round(line.y / 4)}|${line.text.replace(/\d+/g, '#')}`
      if (seen.has(key)) continue
      seen.add(key)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  const limit = Math.max(2, Math.ceil(pages.length / 2))
  return new Set([...counts].filter(([, count]) => count >= limit).map(([key]) => key))
}

/** Char-weighted median font size: the size of the body text. */
function bodySizeOf(blocks) {
  const sizes = blocks
    .filter((block) => block.type === 'text')
    .flatMap((block) => Array(Math.min(block.text.length, 2000)).fill(block.size))
    .sort((a, b) => a - b)
  return sizes[Math.floor(sizes.length / 2)] ?? 12
}

/**
 * @param {object} pdfjs the pdfjs-dist module
 * @param {ArrayBuffer|Uint8Array} data
 * @param {{onPage?: (page: number, total: number) => void}} [options]
 * @returns {Promise<{blocks: object[], textLength: number, pageCount: number}>}
 *   Blocks are `{type: 'heading', level, html, text}`, `{type: 'paragraph', html, text}`,
 *   `{type: 'list', items: string[]}` or `{type: 'image', image}` where `image`
 *   is pdf.js decoded data: `{width, height, bitmap}` or `{width, height, kind, data}`.
 */
export async function extractPdfBlocks(pdfjs, data, { onPage } = {}) {
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false }).promise
  const pages = []

  for (let number = 1; number <= doc.numPages; number += 1) {
    onPage?.(number, doc.numPages)
    const page = await doc.getPage(number)
    // Loading the operator list also loads the fonts and images it uses.
    const opList = await page.getOperatorList()
    const content = await page.getTextContent()
    const styleCache = new Map()
    const lines = buildLines(content.items, (font) => fontStyleOf(page, font, styleCache))

    const placed = locateImages(pdfjs, opList)
    const images = []
    for (const entry of placed) {
      const image = entry.inline ?? (await loadObject(page, entry.id))
      if (!image || image.width < MIN_IMAGE_EDGE || image.height < MIN_IMAGE_EDGE) continue
      images.push({ ...entry, image })
    }
    pages.push({ lines, images })
  }

  // Logos drawn on every page are page furniture, not content.
  const imagePages = new Map()
  pages.forEach((page, index) =>
    page.images.forEach((img) => img.id && imagePages.set(img.id, (imagePages.get(img.id) ?? new Set()).add(index))),
  )
  const repeated = findRepeatedLines(pages)

  const blocks = []
  pages.forEach((page) => {
    const lines = page.lines.filter(
      (line) =>
        !PAGE_NUMBER.test(line.text) &&
        !repeated.has(`${Math.round(line.y / 4)}|${line.text.replace(/\d+/g, '#')}`),
    )
    const rights = lines.map((line) => line.right).sort((a, b) => a - b)
    const pageRight = rights[Math.floor(rights.length * 0.9)] ?? 0

    const seenIds = new Set()
    const images = page.images
      .filter((img) => !img.id || (imagePages.get(img.id).size < 2 || pages.length < 2))
      .filter((img) => !img.id || (!seenIds.has(img.id) && seenIds.add(img.id)))
      .map((img) => ({ type: 'image', top: img.top, image: img.image }))

    const pageBlocks = [...buildParagraphs(lines, pageRight), ...images].sort((a, b) => b.top - a.top)

    // A paragraph cut by the page break continues lower-case on the next page.
    const first = pageBlocks[0]
    const last = blocks[blocks.length - 1]
    if (
      first?.type === 'text' &&
      last?.type === 'text' &&
      !SENTENCE_END.test(last.text) &&
      /^\p{Ll}/u.test(first.text) &&
      Math.abs(first.size - last.size) < 0.5
    ) {
      last.text += ` ${first.text}`
      last.runs.push({ text: ' ', bold: false, italic: false }, ...first.runs)
      pageBlocks.shift()
    }
    blocks.push(...pageBlocks)
  })

  const bodySize = bodySizeOf(blocks)
  const largest = Math.max(0, ...blocks.filter((b) => b.type === 'text').map((b) => b.size))
  let titleTaken = false

  const out = []
  for (const block of blocks) {
    if (block.type === 'image') {
      out.push(block)
      continue
    }
    const isHeading =
      block.text.length <= HEADING_MAX_CHARS &&
      (block.size >= bodySize * HEADING_RATIO ||
        (block.bold && block.text.length <= 120 && !/[.,;]$/.test(block.text)))

    if (isHeading) {
      const isTitle = !titleTaken && out.length <= 1 && block.size >= largest - 0.5 && block.size > bodySize
      titleTaken ||= isTitle
      const level = isTitle ? 1 : block.size >= bodySize * HEADING_RATIO ? 2 : 3
      // Headings carry their own weight; drop the <strong> wrapping.
      out.push({ type: 'heading', level, text: block.text, html: escapeHtml(block.text) })
      continue
    }

    if (block.bullet) {
      const html = runsToHtml(block.runs).replace(/^(<(strong|em)>)*\s*[•●▪■◦·‣\-–—+*]\s+/, '$1')
      const prev = out[out.length - 1]
      if (prev?.type === 'list') prev.items.push(html)
      else out.push({ type: 'list', items: [html] })
      continue
    }

    out.push({ type: 'paragraph', text: block.text, html: runsToHtml(block.runs) })
  }

  const textLength = blocks.reduce((sum, b) => sum + (b.text?.length ?? 0), 0)
  return { blocks: out, textLength, pageCount: doc.numPages, cleanup: () => doc.destroy() }
}

