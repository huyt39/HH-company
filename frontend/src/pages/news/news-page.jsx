import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageBanner } from '@/components/ui/page-banner'
import { Pagination } from '@/components/ui/pagination'
import { StateBlock } from '@/components/ui/state-block'
import { newsApi } from '@/lib/api/news-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { formatDate } from '@/lib/utils/date-format'

const PAGE_SIZE = 9

export function NewsPage() {
  useDocumentMeta({ title: 'Tin tức', description: 'Tin tức và sự kiện của Công ty Hòa Hoàng.' })

  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(
    (options) => newsApi.getArticles({ page, page_size: PAGE_SIZE }, options),
    [page],
  )

  return (
    <>
      <PageBanner
        title="Tin tức & sự kiện"
        subtitle="Cập nhật hoạt động, dự án và thông tin truyền thông của tập đoàn."
        breadcrumb={[{ label: 'Tin tức' }]}
      />

      <section className="section">
        <div className="container">
          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!data?.items?.length}
            emptyTitle="Chưa có bài viết"
          >
            <div className="grid grid--3">
              {data?.items?.map((article) => (
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

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={data?.total ?? 0}
            onChange={setPage}
          />
        </div>
      </section>
    </>
  )
}
