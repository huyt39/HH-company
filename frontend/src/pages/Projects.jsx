import { useMemo, useState } from 'react'

import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import Card from '../components/ui/Card'
import PageBanner from '../components/ui/PageBanner'
import StateBlock from '../components/ui/StateBlock'
import './Projects.css'
import { useDocumentMeta } from '../utils/useDocumentMeta'

const filters = [
  { value: '', label: 'Tất cả' },
  { value: 'in_progress', label: 'Đang triển khai' },
  { value: 'completed', label: 'Đã hoàn thành' },
]

const STATUS_LABEL = {
  in_progress: 'Đang triển khai',
  completed: 'Đã hoàn thành',
  planning: 'Chuẩn bị đầu tư',
}

export default function Projects() {
  useDocumentMeta({ title: 'Dự án', description: 'Các công trình cầu đường, cao tốc và đường sắt Hòa Hoàng đã cung cấp vật tư và thi công lắp đặt.' })

  const [status, setStatus] = useState('')
  const { data, loading, error } = useFetch(
    (opts) => api.getProjects({ page: 1, page_size: 100, status }, opts),
    [status],
  )

  // Nhóm dự án theo năm để danh sách dài vẫn dễ đọc.
  const byYear = useMemo(() => {
    const groups = new Map()
    for (const project of data?.items ?? []) {
      const year = project.year ?? 0
      if (!groups.has(year)) groups.set(year, [])
      groups.get(year).push(project)
    }
    return [...groups.entries()].sort((a, b) => b[0] - a[0])
  }, [data])

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
            {filters.map((filter) => (
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
            {data?.total > 0 && (
              <span className="filter-bar__count">{data.total} dự án</span>
            )}
          </div>

          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!data?.items?.length}
            emptyTitle="Chưa có dự án"
          >
            <div className="year-groups">
              {byYear.map(([year, projects]) => (
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
                        tag={STATUS_LABEL[project.status]}
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
