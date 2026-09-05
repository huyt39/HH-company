import { Link } from 'react-router-dom'

import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/ui/state-block'
import { careersApi } from '@/lib/api/careers-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'
import { formatDate } from '@/lib/utils/date-format'

import './careers-page.css'

const PAGE_SIZE = 20

export function CareersPage() {
  const { t } = useLang()
  useDocumentMeta({ title: t('careers.metaTitle'), description: t('careers.metaDesc') })

  const { data, loading, error } = useFetch(
    (options) => careersApi.getJobs({ page: 1, page_size: PAGE_SIZE }, options),
    [],
  )
  const jobs = data?.items ?? []

  return (
    <>
      <PageBanner title={t('nav.careers')} subtitle={t('careers.bannerSubtitle')} />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('careers.eyebrow')} title={t('careers.title')} />

          {loading && <SkeletonGrid count={3} />}
          {error && <ErrorState error={error} />}
          {!loading && !error && jobs.length === 0 && (
            <EmptyState title={t('careers.empty')} description={t('careers.emptyDesc')} />
          )}

          {jobs.length > 0 && (
            <ul className="job-list">
              {jobs.map((job) => (
                <li className="job-row" key={job.id}>
                  <div>
                    <h3 className="job-row__title">
                      <Link to={`/tuyen-dung/${job.slug}`}>{job.title}</Link>
                    </h3>
                    <div className="job-row__meta">
                      {[job.department, job.location, job.employment_type]
                        .filter(Boolean)
                        .map((meta) => <span key={meta}>{meta}</span>)}
                    </div>
                  </div>
                  <div className="job-row__side">
                    {job.deadline && (
                      <span className="job-row__deadline">{t('careers.deadline')(formatDate(job.deadline))}</span>
                    )}
                    <Link to={`/tuyen-dung/${job.slug}`} className="btn btn--outline">{t('careers.apply')}</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
