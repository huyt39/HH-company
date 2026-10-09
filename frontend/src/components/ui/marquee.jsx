import './marquee.css'

/**
 * Items running sideways in an endless loop (the home page's customer and news
 * strips). One lap is the list — repeated until it holds at least `minItems`,
 * so a short list still spans a wide screen — drawn twice; the track slides by
 * exactly one lap, so the wrap has no visible seam. Hovering pauses it; with
 * reduced motion it is a plain row the visitor scrolls by hand.
 *
 * Only the first copy of each item is real to keyboards and screen readers;
 * the repeats are `aria-hidden` and `inert`, so a link is never tabbed twice.
 *
 * @param {{items: any[], getKey: (item: any) => string,
 *          renderItem: (item: any) => import('react').ReactNode,
 *          itemWidth: string, secondsPerItem: number, minItems?: number,
 *          label?: string}} props
 *   `secondsPerItem` sets the speed per item, so it stays the same whatever the
 *   list length.
 */
export function Marquee({ items, getKey, renderItem, itemWidth, secondsPerItem, minItems = 0, label }) {
  const lap = []
  while (lap.length < Math.max(items.length, minItems)) lap.push(...items)

  const renderLap = (copy) =>
    lap.map((item, index) => {
      const isRepeat = copy > 0 || index >= items.length
      return (
        <li
          className="marquee__item"
          key={`${copy}-${index}-${getKey(item)}`}
          aria-hidden={isRepeat || undefined}
          inert={isRepeat ? '' : undefined}
        >
          {renderItem(item)}
        </li>
      )
    })

  return (
    <div
      className="marquee"
      role="region"
      aria-label={label}
      style={{
        '--marquee-duration': `${lap.length * secondsPerItem}s`,
        '--marquee-item-width': itemWidth,
      }}
    >
      <div className="marquee__track">
        <ul className="marquee__list">{renderLap(0)}</ul>
        <ul className="marquee__list" aria-hidden="true">{renderLap(1)}</ul>
      </div>
    </div>
  )
}
