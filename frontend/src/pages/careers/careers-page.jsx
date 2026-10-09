import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { ErrorState } from '@/components/ui/state-block'
import { careersApi } from '@/lib/api/careers-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'
import { formatDate } from '@/lib/utils/date-format'

import { ApplyButton } from './_components/apply-button'
import { useApplyLink } from './_hooks/use-apply-link'
import './careers-page.css'

const PAGE_SIZE = 50
const INTRO_PHOTO = '/images/cam-ket/ben-luc-long-thanh-cf2c779f.jpg'

/** "4/10/2026" or nothing; past deadlines are left to the admin to unpublish. */
const deadlineOf = (job) => (job.deadline ? formatDate(job.deadline) : '')

/**
 * Careers: who the company is to work for, the open roles as a compact list
 * that can be searched and filtered by department, how to apply, and an open
 * application for when nothing fits — so the page is useful with no openings.
 */
export function CareersPage() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [department, setDepartment] = useState('')
  const applyLink = useApplyLink()
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

  // Department filters come from the roles themselves; none shown for one or none.
  const departments = useMemo(
    () => [...new Set(jobs.map((job) => job.department).filter(Boolean))].sort(),
    [jobs],
  )
  const shown = department ? jobs.filter((job) => job.department === department) : jobs
  useEffect(() => {
    if (department && !departments.includes(department)) setDepartment('')
  }, [department, departments])

  const noJobsAtAll = !loading && !error && !searchQuery && jobs.length === 0

  return (
    <>
      <PageBanner title={t('nav.careers')} subtitle={t('careers.bannerSubtitle')} />

      {/* Who you would be working for. */}
      <section className="section careers-intro">
        <div className="container careers-intro__grid">
          <div>
            <SectionHeading
              eyebrow={t('careers.introEyebrow')}
              title={t('careers.introTitle')}
              description={t('careers.introText')}
            />
            <dl className="careers-stats" data-reveal-stagger>
              {t('careers.stats').map((stat) => (
                <div className="careers-stat" key={stat.label}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="careers-intro__photo" data-reveal>
            <img src={INTRO_PHOTO} alt={t('careers.introPhotoAlt')} loading="lazy" decoding="async" />
          </figure>
        </div>
      </section>

      {/* Open roles. */}
      <section className="section section--soft" id="vi-tri">
        <div className="container">
          <SectionHeading eyebrow={t('careers.eyebrow')} title={t('careers.title')} />

          {!noJobsAtAll && (
            <div className="careers-toolbar">
              <label className="careers-search">
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
              {departments.length > 1 && (
                <div className="careers-filters" role="group" aria-label={t('careers.filterAriaLabel')}>
                  {['', ...departments].map((name) => (
                    <button
                      type="button"
                      key={name || 'all'}
                      className={`careers-filter${department === name ? ' is-active' : ''}`}
                      aria-pressed={department === name}
                      onClick={() => setDepartment(name)}
                    >
                      {name || t('careers.filterAll')}
                    </button>
                  ))}
                </div>
              )}
              {!loading && !error && jobs.length > 0 && (
                <span className="careers-openings__count">{t('careers.openings')(shown.length)}</span>
              )}
            </div>
          )}

          {loading && (
            <div className="job-rows" aria-hidden="true">
              {[0, 1, 2].map((i) => <div className="job-row job-row--skeleton skeleton" key={i} />)}
            </div>
          )}
          {error && <ErrorState error={error} />}

          {!loading && !error && shown.length === 0 && (
            <div className="careers-empty">
              <strong>{searchQuery ? t('careers.noMatch') : t('careers.empty')}</strong>
              <span>{searchQuery ? t('careers.noMatchDesc') : t('careers.openText')}</span>
            </div>
          )}

          {shown.length > 0 && (
            <ul className="job-rows" data-reveal-stagger>
              {shown.map((job) => {
                const tags = [job.department, job.location, job.employment_type].filter(Boolean)
                const deadline = deadlineOf(job)
                return (
                  <li key={job.id}>
                    <Link to={`/tuyen-dung/${job.slug}`} className="job-row">
                      <div className="job-row__main">
                        <h3 className="job-row__title">{job.title}</h3>
                        {tags.length > 0 && (
                          <div className="job-row__tags">
                            {tags.map((tag) => <span key={tag}>{tag}</span>)}
                          </div>
                        )}
                      </div>
                      {deadline && (
                        <span className="job-row__deadline">{t('careers.deadline')(deadline)}</span>
                      )}
                      <span className="job-row__go" aria-hidden="true">
                        <svg viewBox="0 0 20 20" focusable="false">
                          <path d="M6 14 14 6M7.5 6H14v6.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* How to apply, and an open application for when nothing fits. */}
      <section className="section section--dark section--dark-soft careers-apply">
        <div className="container careers-apply__grid">
          <div>
            <SectionHeading eyebrow={t('careers.processEyebrow')} title={t('careers.processTitle')} light />
            <ol className="careers-steps" data-reveal-stagger>
              {t('careers.processSteps').map((step, index) => (
                <li className="careers-step" key={step.title}>
                  <span className="careers-step__index">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="careers-open" data-reveal>
            <span className="careers-open__eyebrow">{t('careers.openEyebrow')}</span>
            <h3 className="careers-open__title">{t('careers.openTitle')}</h3>
            <p>{t('careers.openText')}</p>
            <span className="careers-open__label">{t('careers.openRolesLabel')}</span>
            <ul className="careers-open__roles">
              {t('careers.openRoles').map((role) => <li key={role}>{role}</li>)}
            </ul>
            <ApplyButton link={applyLink(t('careers.openSubject'))} className="btn btn--primary careers-open__cta">
              {t('careers.sendCv')}
            </ApplyButton>
          </div>
        </div>
      </section>
    </>
  )
}
