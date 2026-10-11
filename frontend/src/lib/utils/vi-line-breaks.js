import { VI_COMPOUNDS } from './vi-compounds'

/**
 * Vietnamese puts a space between every syllable, so the browser is free to
 * end a line on "hạng" and carry "mục" to the next, or leave "lộ 1." alone on
 * the last line. These helpers swap the spaces *inside* a word for no-break
 * spaces so the word wraps as one piece. Only what is shown changes — the data
 * keeps its ordinary spaces, so search and forms are unaffected.
 */

const NBSP = '\u00a0'
const L = '\\p{L}\\p{M}' // a letter, with any combining tone mark
const VI_LETTER = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i

const escape = (word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Known compounds ("hạng mục", "thi công"), any case. Longest first, so
// "tổng giám đốc" wins over "giám đốc".
const COMPOUND = new RegExp(
  `(?<![${L}])(?:${[...VI_COMPOUNDS].sort((a, b) => b.length - a.length).map((w) => w.split(' ').map(escape).join(' +')).join('|')})(?![${L}])`,
  'giu',
)

// A run of 2–4 capitalised syllables is a name ("Hồ Chí Minh", "Vũ Bảo Ngọc").
// Words in capitals throughout ("CẦN NHÀ THẦU") are a shouted heading instead.
const CAP = `\\p{Lu}[\\p{Ll}\\p{M}]+`
const NAME = new RegExp(`(?<![${L}\\d])${CAP}(?: +${CAP}){1,3}(?![${L}\\d])`, 'gu')

// A short number stays with the word before it ("Quốc lộ 1", "năm 2013"), and a
// number stays with its unit ("190 tấn", "60 m").
const NUMBER_AFTER = new RegExp(`([${L}]) +(\\d[\\d.,]{0,4}(?![\\d${L}]))`, 'gu')
const UNIT_AFTER = new RegExp(
  `(\\d) +(km|m|mm|cm|m2|m²|m3|m³|tấn|kg|kN|MPa|năm|tháng|ngày|%)(?![${L}])`,
  'giu',
)

// A code or range never breaks at its hyphen or slash ("BXD-00011096",
// "16–24,5 m", "22/QĐ-HĐXD"): a word joiner after the mark forbids it.
const CODE_JOIN = new RegExp(`([${L}\\d])([-–/])(?=[${L}\\d])`, 'gu')
const WORD_JOINER = '\u2060'

const glue = (match) => match.replace(/ +/g, NBSP)

/** `text` with the spaces inside each Vietnamese word made unbreakable. */
export function bindVietnameseWords(text) {
  if (!text) return text
  return text
    .replace(CODE_JOIN, `$1$2${WORD_JOINER}`)
    .replace(COMPOUND, glue)
    .replace(NAME, (match) => (VI_LETTER.test(match) ? glue(match) : match))
    .replace(NUMBER_AFTER, `$1${NBSP}$2`)
    .replace(UNIT_AFTER, `$1${NBSP}$2`)
}

const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE', 'svg'])

function skipped(node) {
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (SKIP.has(el.tagName) || el.isContentEditable) return true
  }
  return false
}

function bindTextNode(node) {
  const next = bindVietnameseWords(node.nodeValue)
  // Only write when something changed, so the observer below does not loop.
  if (next !== node.nodeValue && !skipped(node)) node.nodeValue = next
}

/** Apply `bindVietnameseWords` to every text node under `root`, now and as it changes. */
export function watchVietnameseLineBreaks(root) {
  const walk = (start) => {
    if (start.nodeType === Node.TEXT_NODE) {
      bindTextNode(start)
      return
    }
    const walker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) bindTextNode(node)
  }

  walk(root)
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'characterData') bindTextNode(record.target)
      else record.addedNodes.forEach(walk)
    }
  })
  observer.observe(root, { childList: true, characterData: true, subtree: true })
  return () => observer.disconnect()
}
