import { Link } from 'react-router-dom'

import { useLang } from '@/lib/i18n/language-context'

/**
 * Home hero.
 *
 * The primary action goes to the project record, not the catalogue: a main
 * contractor deciding whether to invite Hoa Hoang to a bridge job wants to see
 * what has been built, then the capability behind it.
 */
export function HeroSection() {
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
          <Link to="/du-an" className="btn btn--primary">{t('home.heroCtaProjects')}</Link>
          <Link to="/nang-luc" className="btn btn--ghost-light">{t('home.heroCtaCapability')}</Link>
        </div>

        {/* The specialities, stated in one line. A visitor should not have to
            open the services page to learn what this contractor actually does
            on site. */}
        <ul className="hero__specialities">
          {t('home.heroSpecialities').map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </section>
  )
}
