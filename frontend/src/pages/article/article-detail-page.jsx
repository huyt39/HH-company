import { Link, useParams } from 'react-router-dom'

import { PageBanner } from '@/components/ui/page-banner'
import { ErrorState } from '@/components/ui/state-block'
import { newsApi } from '@/lib/api/news-client'
import { projectsApi } from '@/lib/api/projects-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { fullUrl } from '@/lib/utils/media'

import { ArticleGallery } from './_components/article-gallery'
import { ProjectContext } from './_components/project-context'
import { ProjectFacts } from './_components/project-facts'
import './article-detail-page.css'

/** Per-type config; two routes share this detail page. */
const VARIANTS = {
  news: {
    listPath: '/tin-tuc',
    listLabel: 'Tin tức',
    fetch: (slug, options) => newsApi.getArticle(slug, options),
  },
  project: {
    listPath: '/du-an',
    listLabel: 'Dự án',
    fetch: (slug, options) => projectsApi.getProject(slug, options),
  },
}

/**
 * Detail page shared by news articles and projects.
 *
 * @param {{type: 'news' | 'project'}} props
 */
export function ArticleDetailPage({ type }) {
  const { slug } = useParams()
  const variant = VARIANTS[type]

  const { data, loading, error } = useFetch(
    (options) => variant.fetch(slug, options),
    [slug, type],
  )

  useDocumentMeta({
    title: data?.title || data?.name,
    description: data?.excerpt || data?.summary,
  })

  const isProject = type === 'project'
  const title = data?.title || data?.name || (loading ? 'Đang tải…' : 'Không tìm thấy nội dung')
  const coverUrl = fullUrl(data?.cover)

  return (
    <>
      <PageBanner
        title={title}
        breadcrumb={[{ label: variant.listLabel, to: variant.listPath }, { label: 'Chi tiết' }]}
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
              {isProject && <ProjectFacts project={data} />}

              {/* Stretching a small photo past its own width is what makes older
                  shots look pixelated, so cap the cover at its real size. */}
              {coverUrl && (
                <img
                  className="article__cover"
                  src={coverUrl}
                  alt={data.cover.alt || ''}
                  width={data.cover.width || undefined}
                  height={data.cover.height || undefined}
                  decoding="async"
                  style={data.cover.width ? { maxWidth: `${data.cover.width}px` } : undefined}
                />
              )}

              <div
                className="article__content"
                dangerouslySetInnerHTML={{
                  __html: data.content || `<p>${data.summary || 'Nội dung đang được cập nhật.'}</p>`,
                }}
              />

              <ArticleGallery media={data.gallery} cover={data.cover} />

              {isProject && (
                <ProjectContext context={data.context} sourceUrl={data.context_source} />
              )}
            </article>
          )}

          <Link to={variant.listPath} className="btn btn--outline article__back">
            ← Quay lại {variant.listLabel.toLowerCase()}
          </Link>
        </div>
      </section>
    </>
  )
}
