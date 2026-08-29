import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { formatDate } from '@/lib/utils/date-format'

/** Latest articles on the home page. */
export function LatestNewsSection({ articles, loading, error }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head-row">
          <SectionHeading eyebrow="Truyền thông" title="Tin tức & sự kiện" />
          <Link to="/tin-tuc" className="btn btn--outline">Tất cả tin tức</Link>
        </div>
        <StateBlock
          loading={loading}
          error={error}
          isEmpty={!articles?.length}
          emptyTitle="Chưa có bài viết"
        >
          <div className="grid grid--3">
            {articles?.map((article) => (
              <Card
                key={article.id}
                to={`/tin-tuc/${article.slug}`}
                media={article.cover}
                tag={article.category?.name}
                title={article.title}
                meta={formatDate(article.published_at)}
                excerpt={article.excerpt}
              />
            ))}
          </div>
        </StateBlock>
      </div>
    </section>
  )
}
