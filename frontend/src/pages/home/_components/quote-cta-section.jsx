import { Link } from 'react-router-dom'

import { useLang } from '@/lib/i18n/language-context'

/** Contact call-to-action at the bottom of the home page. */
export function QuoteCtaSection() {
  const { t } = useLang()

  return (
    <section className="cta">
      <div className="container cta__inner">
        <div>
          <h2>{t('home.ctaTitle')}</h2>
          <p className="mb-0">{t('home.ctaDesc')}</p>
        </div>
        <Link to="/lien-he" className="btn btn--primary">{t('home.ctaButton')}</Link>
      </div>
    </section>
  )
}
