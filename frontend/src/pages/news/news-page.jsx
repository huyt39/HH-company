import { useEffect, useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageBanner } from '@/components/ui/page-banner'
import { Pagination } from '@/components/ui/pagination'
import { StateBlock } from '@/components/ui/state-block'
import { newsApi } from '@/lib/api/news-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'
import { formatDate } from '@/lib/utils/date-format'

const PAGE_SIZE = 9

export function NewsPage() {
  const { t } = useLang()
  useDocumentMeta({ title: t('news.metaTitle'), description: t('news.metaDesc') })

  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(query.trim())
      setPage(1)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [query])

  const { data, loading, error } = useFetch(
    (options) => newsApi.getArticles({ page, page_size: PAGE_SIZE, q: searchQuery }, options),
    [page, searchQuery],
  )

  return (
    <>
      <PageBanner title={t('news.bannerTitle')} subtitle={t('news.bannerSubtitle')} />

      <section className="section">
        <div className="container">
          <div className="filter-bar news-filter-bar">
            <label className="filter-bar__search">
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle cx="9" cy="9" r="6.5" fill="none" strokeWidth="1.8" />
                <line x1="13.6" y1="13.6" x2="18" y2="18" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder={t('news.searchPlaceholder')}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={t('news.searchAriaLabel')}
              />
            </label>
          </div>

          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!data?.items?.length}
            emptyTitle={searchQuery ? t('news.noMatch') : t('news.empty')}
            emptyDescription={searchQuery ? t('news.noMatchDesc') : undefined}
          >
            <div className="grid grid--3" data-reveal-stagger>
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
