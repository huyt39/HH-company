import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageBanner } from '@/components/ui/page-banner'
import { StateBlock } from '@/components/ui/state-block'
import { projectsApi } from '@/lib/api/projects-client'
import {
  PROJECT_STATUS_FILTERS,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_TONE,
} from '@/lib/constants/project-status'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'

import './projects-page.css'

// The page groups every project by year client-side, so fetch them in one go.
const PAGE_SIZE = 100

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
  useDocumentMeta({
    title: 'Dự án',
    description:
      'Các công trình cầu đường, cao tốc và đường sắt Hòa Hoàng đã cung cấp vật tư và thi công lắp đặt.',
  })

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
      <PageBanner
        title="Dự án đã thực hiện"
        subtitle="Các công trình cầu đường, cao tốc và đường sắt Hòa Hoàng đã cung cấp vật tư và thi công lắp đặt."
      />

      <section className="section">
        <div className="container">
          <div className="filter-bar" role="tablist" aria-label="Lọc theo trạng thái">
            {PROJECT_STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value || 'all'}
                type="button"
                role="tab"
                aria-selected={status === filter.value}
                className={`filter-bar__btn ${status === filter.value ? 'is-active' : ''}`}
                onClick={() => setStatus(filter.value)}
              >
                {filter.label}
              </button>
            ))}
            <input
              type="search"
              className="filter-bar__search"
              placeholder="Tìm kiếm dự án…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Tìm kiếm dự án"
            />
            {data?.total > 0 && (
              <span className="filter-bar__count">{filteredProjects.length} dự án</span>
            )}
          </div>

          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!filteredProjects.length}
            emptyTitle={query.trim() ? 'Không tìm thấy dự án phù hợp' : 'Chưa có dự án'}
          >
            <div className="year-groups">
              {yearGroups.map(([year, projects]) => (
                <section className="year-group" key={year}>
                  <h2 className="year-group__title">
                    {year || 'Chưa xác định'}
                    <span>{projects.length} dự án</span>
                  </h2>
                  <div className="grid grid--3">
                    {projects.map((project) => (
                      <Card
                        key={project.id}
                        to={`/du-an/${project.slug}`}
                        media={project.cover}
                        tag={PROJECT_STATUS_LABEL[project.status]}
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
