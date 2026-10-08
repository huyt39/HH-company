import { useEffect, useState } from 'react'
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
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  useDocumentMeta({ title: t('careers.metaTitle'), description: t('careers.metaDesc') })

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(query.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [query])

  const { data, loading, error } = useFetch(
    (options) => careersApi.getJobs({ page: 1, page_size: PAGE_SIZE, q: searchQuery }, options),
    [searchQuery],
  )
  const jobs = data?.items ?? []

  return (
    <>
      <PageBanner title={t('nav.careers')} subtitle={t('careers.bannerSubtitle')} />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('careers.eyebrow')} title={t('careers.title')} />

          <div className="filter-bar careers-filter-bar">
            <label className="filter-bar__search">
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle cx="9" cy="9" r="6.5" fill="none" strokeWidth="1.8" />
                <line x1="13.6" y1="13.6" x2="18" y2="18" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder={t('careers.searchPlaceholder')}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={t('careers.searchAriaLabel')}
              />
            </label>
          </div>

          {loading && <SkeletonGrid count={3} />}
          {error && <ErrorState error={error} />}
          {!loading && !error && jobs.length === 0 && (
            <EmptyState
              title={searchQuery ? t('careers.noMatch') : t('careers.empty')}
              description={searchQuery ? t('careers.noMatchDesc') : t('careers.emptyDesc')}
            />
          )}

          {jobs.length > 0 && (
            <ul className="job-list" data-reveal-stagger>
              {jobs.map((job, index) => (
                <li className="job-card" key={job.id}>
                  <div className="job-card__rail" aria-hidden="true">
                    <span className="job-card__index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="job-card__rail-label">OPEN ROLE</span>
                  </div>
                  <div className="job-card__body">
                    <div className="job-card__topline">
                      <span className="job-card__kicker">{t('careers.eyebrow')}</span>
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
                          <span className="job-card__meta-value">{meta}</span>
                        </span>
                      ))}
                    </div>
                    <div className="job-card__footer">
                      <Link to={`/tuyen-dung/${job.slug}`} className="job-card__detail">
                        {t('careers.detailCrumb')} <span aria-hidden="true">↗</span>
                      </Link>
                      <Link to={`/tuyen-dung/${job.slug}`} className="btn btn--primary">{t('careers.apply')}</Link>
                    </div>
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
