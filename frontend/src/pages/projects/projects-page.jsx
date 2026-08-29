import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageBanner } from '@/components/ui/page-banner'
import { StateBlock } from '@/components/ui/state-block'
import { projectsApi } from '@/lib/api/projects-client'
import { PROJECT_STATUS_FILTERS, PROJECT_STATUS_LABEL } from '@/lib/constants/project-status'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'

import './projects-page.css'

// The page groups every project by year client-side, so fetch them in one go.
const PAGE_SIZE = 100

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
  const { data, loading, error } = useFetch(
    (options) => projectsApi.getProjects({ page: 1, page_size: PAGE_SIZE, status }, options),
    [status],
  )

  const yearGroups = useMemo(() => groupByYear(data?.items ?? []), [data])

  return (
    <>
      <PageBanner
        title="Dự án đã thực hiện"
        subtitle="Các công trình cầu đường, cao tốc và đường sắt Hòa Hoàng đã cung cấp vật tư và thi công lắp đặt."
        breadcrumb={[{ label: 'Dự án' }]}
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
            {data?.total > 0 && <span className="filter-bar__count">{data.total} dự án</span>}
          </div>

          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!data?.items?.length}
            emptyTitle="Chưa có dự án"
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
