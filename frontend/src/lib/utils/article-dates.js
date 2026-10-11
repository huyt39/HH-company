import { toDate } from './date-format'

// Saving a new article and tidying it straight after is one act of writing, not
// an update worth announcing; past this gap the article counts as edited.
const EDIT_GRACE_MS = 60 * 1000

/**
 * When a news article went up, and when it was last changed if it has been
 * edited since. Articles without a `published_at` fall back to when they were
 * created.
 *
 * @param {{published_at?: string, created_at?: string, updated_at?: string}} article
 * @returns {{published: string | null, updated: Date | null}}
 */
export function articleDates(article) {
  const created = toDate(article.created_at)
  const updated = toDate(article.updated_at)
  return {
    published: article.published_at || article.created_at || null,
    updated: created && updated && updated - created > EDIT_GRACE_MS ? updated : null,
  }
}
