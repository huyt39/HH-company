import { Link, useParams } from 'react-router-dom'

import { PageBanner } from '@/components/ui/page-banner'
import { ErrorState } from '@/components/ui/state-block'
import { careersApi } from '@/lib/api/careers-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'
import { formatDate } from '@/lib/utils/date-format'

export function JobDetailPage() {
  const { t } = useLang()
  const { slug } = useParams()
  const { data, loading, error } = useFetch((options) => careersApi.getJob(slug, options), [slug])

  useDocumentMeta({ title: data?.title, description: data?.summary })

  const labels = t('careers.labels')

  // Only what was filled in: a job posted as a file has none of these, and a
  // table of dashes above the letter just looks broken. The head count defaults
  // to 1, so it only counts as information next to other details.
  const facts = data
    ? [
        [labels.department, data.department],
        [labels.location, data.location],
        [labels.employmentType, data.employment_type],
        [labels.deadline, data.deadline && formatDate(data.deadline)],
      ].filter(([, value]) => value)
    : []
  if (facts.length && data.quantity) facts.splice(3, 0, [labels.quantity, data.quantity])

  return (
    <>
      <PageBanner
        title={data?.title || (loading ? t('careers.loadingTitle') : t('careers.notFoundTitle'))}
        breadcrumb={[{ label: t('nav.careers'), to: '/tuyen-dung' }, { label: t('careers.detailCrumb') }]}
      />

      <section className="section">
        <div className="container article">
          {loading && (
            <div className="stack">
              <div className="skeleton skeleton--line" style={{ width: '45%' }} />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line" style={{ width: '80%' }} />
            </div>
          )}

          {error && <ErrorState error={error} />}

          {!loading && !error && data && (
            <>
              {facts.length > 0 && (
                <dl className="article__facts" data-reveal>
                  {facts.map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
              )}

              <div
                data-reveal
                className="article__content"
                dangerouslySetInnerHTML={{
                  __html: data.description || t('careers.descFallback'),
                }}
              />
            </>
          )}

          <Link to="/tuyen-dung" className="btn btn--outline btn--back article__back">
            {t('careers.backToList')}
          </Link>
        </div>
      </section>
    </>
  )
}
