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
              <dl className="article__facts">
                <div><dt>{labels.department}</dt><dd>{data.department || '—'}</dd></div>
                <div><dt>{labels.location}</dt><dd>{data.location || '—'}</dd></div>
                <div><dt>{labels.employmentType}</dt><dd>{data.employment_type || '—'}</dd></div>
                <div><dt>{labels.quantity}</dt><dd>{data.quantity}</dd></div>
                <div><dt>{labels.deadline}</dt><dd>{formatDate(data.deadline)}</dd></div>
              </dl>

              <div
                className="article__content"
                dangerouslySetInnerHTML={{
                  __html: data.description || t('careers.descFallback'),
                }}
              />
            </>
          )}

          <Link to="/tuyen-dung" className="btn btn--outline article__back">
            {t('careers.backToList')}
          </Link>
        </div>
      </section>
    </>
  )
}
