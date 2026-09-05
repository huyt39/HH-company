import { Link } from 'react-router-dom'

import { useLang } from '@/lib/i18n/language-context'

/**
 * Home hero with the highlight stats strip.
 *
 * @param {{stats: {value: string, label: string}[]}} props
 */
export function HeroSection({ stats }) {
  const { t } = useLang()

  return (
    <section className="hero">
      <div className="container hero__inner">
        <span className="hero__eyebrow">Hoa Hoang Intra Co., Ltd</span>
        <h1 className="hero__title">
          {t('home.heroTitle').split('\n').map((line, index) => (
            <span key={index}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>
        <p className="hero__desc">{t('home.heroDesc')}</p>
        <div className="hero__actions">
          <Link to="/san-pham" className="btn btn--primary">{t('home.heroCtaProducts')}</Link>
          <Link to="/du-an" className="btn btn--ghost-light">{t('home.heroCtaProjects')}</Link>
        </div>
      </div>

      <div className="hero__stats">
        <div className="container hero__stats-grid">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
