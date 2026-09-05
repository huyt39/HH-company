import { Link } from 'react-router-dom'

import { useLang } from '@/lib/i18n/language-context'

import './not-found-page.css'

export function NotFoundPage() {
  const { t } = useLang()

  return (
    <section className="section">
      <div className="container text-center not-found">
        <p className="not-found__code">404</p>
        <h1>{t('notFound.title')}</h1>
        <p className="text-muted">{t('notFound.desc')}</p>
        <Link to="/" className="btn btn--primary">{t('notFound.backHome')}</Link>
      </div>
    </section>
  )
}
