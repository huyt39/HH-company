import { BaseApiClient } from './base-client'

/** Job postings. */
class CareersApiClient extends BaseApiClient {
  /** @param {{page?: number, page_size?: number}} [params] */
  getJobs(params, options) {
    return this.get('/careers', params, options)
  }

  getJob(slug, options) {
    return this.get(`/careers/${slug}`, undefined, options)
  }
}

export const careersApi = new CareersApiClient()
