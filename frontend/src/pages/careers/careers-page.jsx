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
            <ul className="job-list" data-reveal-stagger>
              {jobs.map((job, index) => (
                <li className="job-card" key={job.id}>
                  <div className="job-card__topline">
                    <span className="job-card__index">{String(index + 1).padStart(2, '0')}</span>
                    {job.deadline && (
                      <span className="job-card__deadline">{t('careers.deadline')(formatDate(job.deadline))}</span>
                    )}
                  </div>
                  <h3 className="job-card__title">
                    <Link to={`/tuyen-dung/${job.slug}`}>{job.title}</Link>
                  </h3>
                  <div className="job-card__meta">
                    {[
                      [t('careers.labels.department'), job.department],
                      [t('careers.labels.location'), job.location],
                      [t('careers.labels.employmentType'), job.employment_type],
                    ].filter(([, meta]) => meta).map(([label, meta]) => (
                      <span className="job-card__meta-item" key={meta}>
                        <span className="job-card__meta-label">{label}</span>
                        {meta}
                      </span>
                    ))}
                  </div>
                  <div className="job-card__footer">
                    <Link to={`/tuyen-dung/${job.slug}`} className="job-card__detail">
                      {t('careers.detailCrumb')} <span aria-hidden="true">↗</span>
                    </Link>
                    <Link to={`/tuyen-dung/${job.slug}`} className="btn btn--primary">{t('careers.apply')}</Link>
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
