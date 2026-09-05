import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageBanner } from '@/components/ui/page-banner'
import { StateBlock } from '@/components/ui/state-block'
import { projectsApi } from '@/lib/api/projects-client'
import { PROJECT_STATUS_TONE } from '@/lib/constants/project-status'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import './projects-page.css'

// The page groups every project by year client-side, so fetch them in one go.
const PAGE_SIZE = 100

// Matches PROJECT_STATUS_FILTERS' values; labels are translated at render time.
const STATUS_FILTER_VALUES = ['', 'in_progress', 'completed']

/** Strip Vietnamese diacritics and lowercase, so search ignores accents. */
function normalize(text) {
  return (text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
}

/** Group projects by year, newest first. */
function groupByYear(projects) {
  const groups = new Map()
  for (const project of projects) {
    const year = project.year ?? 0
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year).push(project)
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0])
}

export function ProjectsPage() {
  const { t } = useLang()
  useDocumentMeta({ title: t('projects.metaTitle'), description: t('projects.metaDesc') })

  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const { data, loading, error } = useFetch(
    (options) => projectsApi.getProjects({ page: 1, page_size: PAGE_SIZE, status }, options),
    [status],
  )

  const filteredProjects = useMemo(() => {
    const items = data?.items ?? []
    const term = normalize(query.trim())
    if (!term) return items
    return items.filter((project) =>
      [project.name, project.location, project.summary].some((field) =>
        normalize(field).includes(term),
      ),
    )
  }, [data, query])

  const yearGroups = useMemo(() => groupByYear(filteredProjects), [filteredProjects])

  return (
    <>
      <PageBanner title={t('projects.bannerTitle')} subtitle={t('projects.metaDesc')} />

      <section className="section">
        <div className="container">
          <div className="filter-bar" role="tablist" aria-label={t('projects.filterAriaLabel')}>
            {STATUS_FILTER_VALUES.map((value) => (
              <button
                key={value || 'all'}
                type="button"
                role="tab"
                aria-selected={status === value}
                className={`filter-bar__btn ${status === value ? 'is-active' : ''}`}
                onClick={() => setStatus(value)}
              >
                {t(`projectStatus.${value || 'all'}`)}
              </button>
            ))}
            <label className="filter-bar__search">
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle cx="9" cy="9" r="6.5" fill="none" strokeWidth="1.8" />
                <line x1="13.6" y1="13.6" x2="18" y2="18" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder={t('projects.searchPlaceholder')}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={t('projects.searchAriaLabel')}
              />
            </label>
            {data?.total > 0 && (
              <span className="filter-bar__count">{t('projects.count')(filteredProjects.length)}</span>
            )}
          </div>

          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!filteredProjects.length}
            emptyTitle={query.trim() ? t('projects.emptyNoMatch') : t('projects.emptyNone')}
          >
            <div className="year-groups">
              {yearGroups.map(([year, projects]) => (
                <section className="year-group" key={year}>
                  <h2 className="year-group__title">
                    {year || t('common.undated')}
                    <span>{t('projects.count')(projects.length)}</span>
                  </h2>
                  <div className="grid grid--3">
                    {projects.map((project) => (
                      <Card
                        key={project.id}
                        to={`/du-an/${project.slug}`}
                        media={project.cover}
                        tag={t(`projectStatus.${project.status}`)}
                        tagTone={PROJECT_STATUS_TONE[project.status]}
                        title={project.name}
                        meta={project.location}
                        excerpt={project.summary}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </StateBlock>
        </div>
      </section>
    </>
  )
}
