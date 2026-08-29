import { BaseApiClient } from './base-client'

/** News and events. */
class NewsApiClient extends BaseApiClient {
  /** @param {{page?: number, page_size?: number}} [params] */
  getArticles(params, options) {
    return this.get('/news', params, options)
  }

  getArticle(slug, options) {
    return this.get(`/news/${slug}`, undefined, options)
  }
}

export const newsApi = new NewsApiClient()
