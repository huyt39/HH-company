import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageBanner } from '@/components/ui/page-banner'
import { StateBlock } from '@/components/ui/state-block'
import { projectsApi } from '@/lib/api/projects-client'
import { PROJECT_STATUS_TONE } from '@/lib/constants/project-status'
import { PROJECT_ROLE_TONE, PROJECT_WORK_TYPE_FILTERS } from '@/lib/constants/services'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import './projects-page.css'

// The page groups every project by year client-side, so fetch them in one go.
const PAGE_SIZE = 100

// Matches PROJECT_STATUS_FILTERS' values; labels are translated at render time.
const STATUS_FILTER_VALUES = ['', 'in_progress', 'completed']

// Role tells a main contractor whether Hoa Hoang built the job or supplied it.
const ROLE_FILTER_VALUES = ['', 'construction', 'supply']

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
  const [role, setRole] = useState('')
  const [workType, setWorkType] = useState('')
  const [query, setQuery] = useState('')
  const { data, loading, error } = useFetch(
    (options) => projectsApi.getProjects({ page: 1, page_size: PAGE_SIZE, status }, options),
    [status],
  )

  const filteredProjects = useMemo(() => {
    const term = normalize(query.trim())
    return (data?.items ?? []).filter((project) => {
      if (role && project.role !== role) return false
      if (workType && !project.work_types?.includes(workType)) return false
      if (!term) return true
      return [project.name, project.location, project.summary, project.structure_type].some(
        (field) => normalize(field).includes(term),
      )
    })
  }, [data, query, role, workType])

  const yearGroups = useMemo(() => groupByYear(filteredProjects), [filteredProjects])

  // Only offer work-type chips that actually match something in the list.
  const availableWorkTypes = useMemo(() => {
    const present = new Set((data?.items ?? []).flatMap((project) => project.work_types ?? []))
    return PROJECT_WORK_TYPE_FILTERS.filter((value) => present.has(value))
  }, [data])

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

          <div className="filter-row">
            <div className="filter-row__group" role="group" aria-label={t('projects.roleFilterAriaLabel')}>
              <span className="filter-row__label">{t('projects.roleFilterLabel')}</span>
              {ROLE_FILTER_VALUES.map((value) => (
                <button
                  key={value || 'all'}
                  type="button"
                  aria-pressed={role === value}
                  className={`chip ${role === value ? 'is-active' : ''}`}
                  onClick={() => setRole(value)}
                >
                  {t(`projectRole.${value || 'all'}`)}
                </button>
              ))}
            </div>

            {availableWorkTypes.length > 0 && (
              <div
                className="filter-row__group"
                role="group"
                aria-label={t('projects.workTypeFilterAriaLabel')}
              >
                <span className="filter-row__label">{t('projects.workTypeFilterLabel')}</span>
                <button
                  type="button"
                  aria-pressed={workType === ''}
                  className={`chip ${workType === '' ? 'is-active' : ''}`}
                  onClick={() => setWorkType('')}
                >
                  {t('projectStatus.all')}
                </button>
                {availableWorkTypes.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={workType === value}
                    className={`chip ${workType === value ? 'is-active' : ''}`}
                    onClick={() => setWorkType(value)}
                  >
                    {t('workTypes')[value] ?? value}
                  </button>
                ))}
              </div>
            )}
          </div>

          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!filteredProjects.length}
            emptyTitle={query.trim() || role || workType ? t('projects.emptyNoMatch') : t('projects.emptyNone')}
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
                        tag={project.role ? t(`projectRole.${project.role}`) : t(`projectStatus.${project.status}`)}
                        tagTone={
                          project.role
                            ? PROJECT_ROLE_TONE[project.role]
                            : PROJECT_STATUS_TONE[project.status]
                        }
                        title={project.name}
                        meta={[project.structure_type, project.location].filter(Boolean).join(' · ')}
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
