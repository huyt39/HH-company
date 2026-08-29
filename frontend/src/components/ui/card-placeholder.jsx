/**
 * Drawn cover for a card that has no photo yet.
 *
 * Bridge photography we are allowed to publish is scarce, and borrowing press
 * photos would both breach copyright and imply Hoa Hoang shot the work. So an
 * empty card gets a brand-coloured structural motif instead — it reads as a
 * deliberate cover rather than a missing image.
 *
 * The motif is picked from `seed` (the project name), so a card keeps the same
 * drawing across reloads and a grid of cards does not repeat one shape.
 */

const MOTIFS = [cableStayed, archBridge, viaduct]

function hashOf(seed = '') {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return Math.abs(hash)
}

/** Cable-stayed: two pylons with a fan of stays. */
function cableStayed() {
  const pylons = [
    { x: 52, top: 16 },
    { x: 116, top: 26 },
  ]
  return (
    <>
      {pylons.map(({ x, top }) => (
        <g key={x}>
          {[-40, -28, -16, 16, 28, 40].map((offset) => (
            <line key={offset} x1={x} y1={top + 4} x2={x + offset} y2="70" />
          ))}
          <line x1={x} y1={top} x2={x} y2="70" strokeWidth="2.4" />
        </g>
      ))}
      <line x1="0" y1="70" x2="160" y2="70" strokeWidth="2.4" />
    </>
  )
}

/** Tied arch with vertical hangers. */
function archBridge() {
  return (
    <>
      <path d="M12 72 Q 80 10 148 72" strokeWidth="2.4" fill="none" />
      {[26, 40, 54, 68, 82, 96, 110, 124, 138].map((x) => {
        // Meet the quadratic Bézier above, which does NOT pass through its
        // control point: expanding B(t) for the three points leaves x linear
        // in t (they are evenly spaced) and y = 72 - 124·t·(1-t).
        const t = (x - 12) / 136
        const y = 72 - 124 * t * (1 - t)
        return <line key={x} x1={x} y1={y} x2={x} y2="72" />
      })}
      <line x1="0" y1="72" x2="160" y2="72" strokeWidth="2.4" />
    </>
  )
}

/** Girder viaduct on piers. */
function viaduct() {
  return (
    <>
      <line x1="0" y1="52" x2="160" y2="52" strokeWidth="2.4" />
      <line x1="0" y1="60" x2="160" y2="60" strokeWidth="1.2" />
      {[26, 62, 98, 134].map((x) => (
        <g key={x}>
          <line x1={x} y1="60" x2={x} y2="92" strokeWidth="2.4" />
          <line x1={x - 9} y1="92" x2={x + 9} y2="92" strokeWidth="1.6" />
        </g>
      ))}
    </>
  )
}

/** @param {{seed?: string}} props */
export function CardPlaceholder({ seed }) {
  const Motif = MOTIFS[hashOf(seed) % MOTIFS.length]

  return (
    <svg
      className="card__placeholder"
      viewBox="0 0 160 100"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g className="card__placeholder-art" strokeWidth="1" strokeLinecap="round">
        <Motif />
      </g>
    </svg>
  )
}
