import { Link, useParams } from 'react-router-dom'

import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import PageBanner from '../components/ui/PageBanner'
import { ErrorState } from '../components/ui/StateBlock'
import { thumbUrl } from '../utils/media'
import { useDocumentMeta } from '../utils/useDocumentMeta'
import './ArticleDetail.css'

const STATUS_LABEL = {
  in_progress: 'Đang triển khai',
  completed: 'Đã hoàn thành',
  planning: 'Chuẩn bị đầu tư',
}

/**
 * Trang chi tiết dùng chung cho tin tức và dự án.
 * @param {{type: 'news' | 'project'}} props
 */
export default function ArticleDetail({ type }) {
  const { slug } = useParams()
  const isNews = type === 'news'

  const { data, loading, error } = useFetch(
    (opts) => (isNews ? api.getNewsItem(slug, opts) : api.getProject(slug, opts)),
    [slug, isNews],
  )

  useDocumentMeta({
    title: data?.title || data?.name,
    description: data?.excerpt || data?.summary,
  })

  const listPath = isNews ? '/tin-tuc' : '/du-an'
  const listLabel = isNews ? 'Tin tức' : 'Dự án'
  const title = data?.title || data?.name || (loading ? 'Đang tải…' : 'Không tìm thấy nội dung')

  return (
    <>
      <PageBanner
        title={title}
        breadcrumb={[{ label: listLabel, to: listPath }, { label: 'Chi tiết' }]}
      />

      <section className="section">
        <div className="container article">
          {loading && (
            <div className="stack">
              <div className="skeleton skeleton--line" style={{ width: '40%' }} />
              <div className="skeleton skeleton--media" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line" />
            </div>
          )}

          {error && <ErrorState error={error} />}

          {!loading && !error && data && (
            <article>
              {!isNews && (
                <dl className="article__facts">
                  <div><dt>Năm thực hiện</dt><dd>{data.year || '—'}</dd></div>
                  <div><dt>Địa điểm</dt><dd>{data.location || '—'}</dd></div>
                  <div><dt>Trạng thái</dt><dd>{STATUS_LABEL[data.status] || '—'}</dd></div>
                  <div className="article__facts--wide"><dt>Khách hàng / nhà thầu</dt><dd>{data.investor || '—'}</dd></div>
                  <div className="article__facts--wide"><dt>Phạm vi cung cấp</dt><dd>{data.scale || '—'}</dd></div>
                </dl>
              )}

              {data.cover?.url && (
                <img
                  className="article__cover"
                  src={data.cover.url}
                  alt={data.cover.alt || ''}
                  decoding="async"
                />
              )}

              <div
                className="article__content"
                dangerouslySetInnerHTML={{
                  __html: data.content || `<p>${data.summary || 'Nội dung đang được cập nhật.'}</p>`,
                }}
              />

              {data.gallery?.length > 0 && (
                <section className="article__gallery">
                  <h2>Hình ảnh thi công</h2>
                  <div className="article__gallery-grid">
                    {data.gallery.map((media) => (
                      <figure key={media.url}>
                        <img src={thumbUrl(media)} alt={media.alt || ''} loading="lazy" decoding="async" />
                        {media.alt && <figcaption>{media.alt}</figcaption>}
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {!isNews && data.context && (
                <aside className="context-box">
                  <h2>Bối cảnh dự án</h2>
                  <p>{data.context}</p>
                  <p className="context-box__note">
                    Thông tin tổng hợp từ nguồn tin công khai, không thuộc phạm vi công việc của Hòa Hoàng.
                    {data.context_source && (
                      <>
                        {' '}
                        <a href={data.context_source} target="_blank" rel="noopener noreferrer">
                          Xem nguồn ↗
                        </a>
                      </>
                    )}
                  </p>
                </aside>
              )}
            </article>
          )}

          <Link to={listPath} className="btn btn--outline article__back">
            ← Quay lại {listLabel.toLowerCase()}
          </Link>
        </div>
      </section>
    </>
  )
}
