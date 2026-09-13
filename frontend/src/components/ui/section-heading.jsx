import './section-heading.css'

/**
 * `eyebrowBelow` moves the label under the title and lets it carry the rule
 * that normally closes the heading. Rendered in that order in the markup too,
 * so a screen reader hears it where it is read. `largeEyebrow` is the size on
 * its own, for sections that want the bigger label in its usual place.
 *
 * @param {{eyebrow?: string, title: string, description?: string,
 *          align?: 'left' | 'center', light?: boolean,
 *          eyebrowBelow?: boolean, largeEyebrow?: boolean}} props
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  eyebrowBelow = false,
  largeEyebrow = false,
}) {
  const classes = [
    'section-heading',
    `section-heading--${align}`,
    light ? 'is-light' : '',
    eyebrowBelow ? 'is-eyebrow-below' : '',
    largeEyebrow || eyebrowBelow ? 'is-eyebrow-lg' : '',
  ].filter(Boolean).join(' ')

  const label = eyebrow ? <span className="section-heading__eyebrow">{eyebrow}</span> : null

  return (
    <div className={classes}>
      {!eyebrowBelow && label}
      <h2>{title}</h2>
      {eyebrowBelow && label}
      {description && <p className="section-heading__desc">{description}</p>}
    </div>
  )
}
