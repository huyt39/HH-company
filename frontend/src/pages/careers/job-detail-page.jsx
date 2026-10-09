import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { PageBanner } from '@/components/ui/page-banner'
import { ErrorState } from '@/components/ui/state-block'
import { careersApi } from '@/lib/api/careers-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'
import { formatDate } from '@/lib/utils/date-format'

import { ApplyButton } from './_components/apply-button'
import { useApplyLink } from './_hooks/use-apply-link'
import './careers-page.css'

/**
 * One role: the description on the left, and a card that stays in view on the
 * right with the role's details and the way to apply. On phones the card sits
 * above the description and an apply bar stays at the foot of the screen.
 */
export function JobDetailPage() {
  const { t } = useLang()
  const { slug } = useParams()
  const { data, loading, error } = useFetch((options) => careersApi.getJob(slug, options), [slug])
  const applyLink = useApplyLink()
  const [copied, setCopied] = useState(false)
  // The phone apply bar only shows once the card's own button has scrolled away.
  const cardRef = useRef(null)
  const [cardInView, setCardInView] = useState(true)
  useEffect(() => {
    const card = cardRef.current
    if (!card || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => setCardInView(entry.isIntersecting))
    observer.observe(card)
    return () => observer.disconnect()
  }, [data])

  useDocumentMeta({ title: data?.title, description: data?.summary })

  const labels = t('careers.labels')

  // Only what was filled in: a job posted as a file has none of these, and a
  // list of dashes just looks broken. The head count defaults to 1, so it only
  // counts as information next to other details.
  const facts = data
    ? [
        [labels.department, data.department],
        [labels.location, data.location],
        [labels.employmentType, data.employment_type],
        [labels.deadline, data.deadline && formatDate(data.deadline)],
      ].filter(([, value]) => value)
    : []
  if (facts.length && data.quantity) facts.splice(3, 0, [labels.quantity, data.quantity])

  const apply = data ? applyLink(t('careers.applySubject')(data.title)) : null

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — nothing to do */
    }
  }

  return (
    <>
      <PageBanner
        title={data?.title || (loading ? t('careers.loadingTitle') : t('careers.notFoundTitle'))}
        breadcrumb={[{ label: t('nav.careers'), to: '/tuyen-dung' }, { label: t('careers.detailCrumb') }]}
      />

      <section className="section">
        <div className="container">
          {loading && (
            <div className="stack">
              <div className="skeleton skeleton--line" style={{ width: '45%' }} />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line" style={{ width: '80%' }} />
            </div>
          )}

          {error && <ErrorState error={error} />}

          {!loading && !error && data && (
            <div className="job-detail">
              <aside className="job-aside" data-reveal>
                <div className="job-aside__card" ref={cardRef}>
                  <h2 className="job-aside__title">{t('careers.applyTitle')}</h2>
                  {facts.length > 0 && (
                    <dl className="job-aside__facts">
                      {facts.map(([label, value]) => (
                        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                      ))}
                    </dl>
                  )}
                  <p className="job-aside__note">{t('careers.applyText')}</p>
                  <ApplyButton link={apply} className="btn btn--primary job-aside__apply">
                    {t('careers.applyByEmail')}
                  </ApplyButton>
                  <button type="button" className="job-aside__copy" onClick={copyLink}>
                    {copied ? t('careers.copied') : t('careers.copyLink')}
                  </button>
                </div>
                <Link to="/tuyen-dung" className="job-aside__back">← {t('careers.backToList')}</Link>
              </aside>

              <div
                data-reveal
                className="article__content job-detail__content"
                dangerouslySetInnerHTML={{
                  __html: data.description || t('careers.descFallback'),
                }}
              />

              {/* Phones: the way to apply stays one tap away while reading. */}
              <div
                className="job-applybar"
                data-hidden={cardInView || undefined}
                inert={cardInView ? '' : undefined}
              >
                <span className="job-applybar__title">{data.title}</span>
                <ApplyButton link={apply} className="btn btn--primary">{t('careers.apply')}</ApplyButton>
              </div>
            </div>
          )}

          {!loading && (error || !data) && (
            <Link to="/tuyen-dung" className="btn btn--outline btn--back article__back">
              {t('careers.backToList')}
            </Link>
          )}
        </div>
      </section>
    </>
  )
}
