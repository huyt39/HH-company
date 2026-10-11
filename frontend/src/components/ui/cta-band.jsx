import { Link } from 'react-router-dom'

import './cta-band.css'

/**
 * Dark call-to-action band at the foot of a page. With an `image` it runs
 * picture | text | button; without one, text | button.
 *
 * @param {{eyebrow?: string, title: string, description?: string, buttonLabel: string, to?: string, image?: string}} props
 */
export function CtaBand({ eyebrow, title, description, buttonLabel, to = '/lien-he', image }) {
  return (
    <section className="cta">
      <div className="container">
        <div className={`cta__inner${image ? '' : ' cta__inner--text'}`} data-reveal-stagger>
          {image && (
            <div className="cta__media" aria-hidden="true">
              <img src={image} alt="" loading="lazy" decoding="async" />
            </div>
          )}
          <div className="cta__content">
            {eyebrow && <span className="cta__eyebrow">{eyebrow}</span>}
            <h2>{title}</h2>
            {description && <p className="mb-0">{description}</p>}
          </div>
          <div className="cta__action">
            <Link to={to} className="btn btn--primary">{buttonLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
