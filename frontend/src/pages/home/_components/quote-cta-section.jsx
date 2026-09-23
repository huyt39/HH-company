import { Link } from 'react-router-dom'

import { useLang } from '@/lib/i18n/language-context'

/** Contact call-to-action at the bottom of the home page. */
export function QuoteCtaSection() {
  const { t } = useLang()

  return (
    <section className="cta">
      <div className="container">
        <div className="cta__inner">
          <div className="cta__media" aria-hidden="true">
            <img
              src="/images/cong-truong/ky-su-hoa-hoang-tai-cong-truong-6e4c117f.jpg"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="cta__content">
            <span className="cta__eyebrow">{t('home.ctaEyebrow')}</span>
            <h2>{t('home.ctaTitle')}</h2>
            <p className="mb-0">{t('home.ctaDesc')}</p>
          </div>
          <div className="cta__action">
            <Link to="/lien-he" className="btn btn--primary">{t('home.ctaButton')}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
