import { useLang } from '@/lib/i18n/language-context'
import { articleDates } from '@/lib/utils/article-dates'
import { formatDate } from '@/lib/utils/date-format'

/**
 * When a news article went up and, if it has been edited since, when it was
 * last changed — so readers know how fresh it is.
 *
 * @param {{article: {published_at?: string, created_at?: string, updated_at?: string}}} props
 */
export function ArticleDates({ article }) {
  const { t } = useLang()
  const { published, updated } = articleDates(article)

  if (!published && !updated) return null

  return (
    <p className="article__dates">
      {published && (
        <span>
          {t('article.publishedOn')} <time dateTime={published}>{formatDate(published)}</time>
        </span>
      )}
      {updated && (
        <span className="article__dates-updated">
          {t('article.updatedOn')} <time dateTime={updated.toISOString()}>{formatDate(updated)}</time>
        </span>
      )}
    </p>
  )
}
