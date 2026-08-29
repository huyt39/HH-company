import './section-heading.css'

/**
 * @param {{eyebrow?: string, title: string, description?: string,
 *          align?: 'left' | 'center', light?: boolean}} props
 */
export function SectionHeading({ eyebrow, title, description, align = 'left', light = false }) {
  return (
    <div className={`section-heading section-heading--${align} ${light ? 'is-light' : ''}`}>
      {eyebrow && <span className="section-heading__eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p className="section-heading__desc">{description}</p>}
    </div>
  )
}
