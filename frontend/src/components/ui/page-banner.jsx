import { Link } from 'react-router-dom'

import { SplitText } from './split-text'
import './page-banner.css'

const LONG_TITLE = 48

/**
 * Sub-page banner with breadcrumb.
 *
 * @param {{title: string, subtitle?: string, breadcrumb?: {label: string, to?: string}[]}} props
 */
export function PageBanner({ title, subtitle, breadcrumb = [] }) {
  // An article headline runs to a sentence; at section-title size it would
  // fill a phone screen, so long titles get a smaller step.
  const long = typeof title === 'string' && title.length > LONG_TITLE
  return (
    <section className={long ? 'page-banner page-banner--long' : 'page-banner'}>
      <div className="container" data-reveal-stagger>
        <h1 data-reveal-text>{typeof title === 'string' ? <SplitText text={title} /> : title}</h1>
        {subtitle && <p className="page-banner__subtitle">{subtitle}</p>}

        {breadcrumb.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {breadcrumb.map((crumb, index) => (
              <span key={crumb.label}>
                {index > 0 && <span className="breadcrumb__sep" aria-hidden="true">/</span>}
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}
      </div>
    </section>
  )
}
