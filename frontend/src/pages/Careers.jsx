import { Link } from 'react-router-dom'

import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import PageBanner from '../components/ui/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import { EmptyState, ErrorState, SkeletonGrid } from '../components/ui/StateBlock'
import './Careers.css'
import { useDocumentMeta } from '../utils/useDocumentMeta'

export default function Careers() {
  useDocumentMeta({ title: 'Tuyển dụng', description: 'Cơ hội nghề nghiệp tại Công ty Hòa Hoàng.' })

  const { data, loading, error } = useFetch(
    (opts) => api.getJobs({ page: 1, page_size: 20 }, opts),
    [],
  )
  const jobs = data?.items ?? []

  return (
    <>
      <PageBanner
        title="Tuyển dụng"
        subtitle="Cơ hội nghề nghiệp và môi trường phát triển tại tập đoàn."
        breadcrumb={[{ label: 'Tuyển dụng' }]}
      />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Cơ hội" title="Vị trí đang tuyển" />

          {loading && <SkeletonGrid count={3} />}
          {error && <ErrorState error={error} />}
          {!loading && !error && jobs.length === 0 && (
            <EmptyState title="Chưa có vị trí tuyển dụng" description="Vui lòng quay lại sau." />
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
                    {job.deadline && <span className="job-row__deadline">Hạn nộp: {job.deadline}</span>}
                    <Link to={`/tuyen-dung/${job.slug}`} className="btn btn--outline">Ứng tuyển</Link>
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
