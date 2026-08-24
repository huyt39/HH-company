import { Link, useParams } from 'react-router-dom'

import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import PageBanner from '../components/ui/PageBanner'
import { ErrorState } from '../components/ui/StateBlock'

export default function JobDetail() {
  const { slug } = useParams()
  const { data, loading, error } = useFetch((opts) => api.getJob(slug, opts), [slug])

  return (
    <>
      <PageBanner
        title={data?.title || (loading ? 'Đang tải…' : 'Không tìm thấy vị trí')}
        breadcrumb={[{ label: 'Tuyển dụng', to: '/tuyen-dung' }, { label: 'Chi tiết' }]}
      />

      <section className="section">
        <div className="container article">
          {loading && (
            <div className="stack">
              <div className="skeleton skeleton--line" style={{ width: '45%' }} />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line" style={{ width: '80%' }} />
            </div>
          )}

          {error && <ErrorState error={error} />}

          {!loading && !error && data && (
            <>
              <dl className="article__facts">
                <div><dt>Bộ phận</dt><dd>{data.department || '—'}</dd></div>
                <div><dt>Nơi làm việc</dt><dd>{data.location || '—'}</dd></div>
                <div><dt>Hình thức</dt><dd>{data.employment_type || '—'}</dd></div>
                <div><dt>Số lượng</dt><dd>{data.quantity}</dd></div>
                <div><dt>Hạn nộp</dt><dd>{data.deadline || '—'}</dd></div>
              </dl>

              <div
                className="article__content"
                dangerouslySetInnerHTML={{ __html: data.description || '<p>Mô tả công việc đang được cập nhật.</p>' }}
              />
            </>
          )}

          <Link to="/tuyen-dung" className="btn btn--outline article__back">← Quay lại danh sách</Link>
        </div>
      </section>
    </>
  )
}
