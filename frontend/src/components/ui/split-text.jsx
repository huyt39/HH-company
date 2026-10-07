// Split by grapheme, not code unit, so a Vietnamese letter with a combining
// tone mark stays one piece.
const segmenter =
  typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('vi', { granularity: 'grapheme' }) : null

const graphemes = (word) => (segmenter ? [...segmenter.segment(word)].map((part) => part.segment) : [...word])

/**
 * Text split into per-letter spans so a heading can rise in letter by letter
 * (see `data-reveal-text` in `use-scroll-reveal`). Words stay unbreakable and
 * wrap only at real spaces; screen readers get the plain text.
 *
 * @param {{text: string, offset?: number}} props `offset` continues the letter
 *   count from an earlier line, so a multi-line title plays as one sequence.
 */
export function SplitText({ text, offset = 0 }) {
  let index = offset
  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {text.split(/( +)/).map((part, wordIndex) =>
          /^ *$/.test(part) ? (
            part
          ) : (
            <span className="split-word" key={wordIndex}>
              {graphemes(part).map((char, charIndex) => (
                <span className="split-char" key={charIndex} style={{ '--i': index++ }}>
                  {char}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </>
  )
}
