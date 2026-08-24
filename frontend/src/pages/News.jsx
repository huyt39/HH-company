import { useState } from 'react'

import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import Card from '../components/ui/Card'
import PageBanner from '../components/ui/PageBanner'
import Pagination from '../components/ui/Pagination'
import StateBlock from '../components/ui/StateBlock'
import { useDocumentMeta } from '../utils/useDocumentMeta'

const PAGE_SIZE = 9

export default function News() {
  useDocumentMeta({ title: 'Tin tức', description: 'Tin tức và sự kiện của Công ty Hòa Hoàng.' })

  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(
    (opts) => api.getNews({ page, page_size: PAGE_SIZE }, opts),
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
              {data?.items?.map((item) => (
                <Card
                  key={item.id}
                  to={`/tin-tuc/${item.slug}`}
                  media={item.cover}
                  tag={item.category?.name}
                  title={item.title}
                  meta={item.published_at}
                  excerpt={item.excerpt}
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
