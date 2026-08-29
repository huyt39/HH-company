import { Link } from 'react-router-dom'

import './page-banner.css'

/**
 * Sub-page banner with breadcrumb.
 *
 * @param {{title: string, subtitle?: string, breadcrumb?: {label: string, to?: string}[]}} props
 */
export function PageBanner({ title, subtitle, breadcrumb = [] }) {
  return (
    <section className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p className="page-banner__subtitle">{subtitle}</p>}

        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link>
          {breadcrumb.map((crumb) => (
            <span key={crumb.label}>
              <span className="breadcrumb__sep" aria-hidden="true">/</span>
              {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}
