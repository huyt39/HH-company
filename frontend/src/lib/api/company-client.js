import { BaseApiClient } from './base-client'

/**
 * Company profile, contact info and partners.
 *
 * Financial figures are admin-only — there is no public endpoint for them.
 */
class CompanyApiClient extends BaseApiClient {
  getProfile(options) {
    return this.get('/company/profile', undefined, options)
  }

  getContactInfo(options) {
    return this.get('/company/contact-info', undefined, options)
  }

  /** @param {{role?: 'customer' | 'manufacturer'}} [params] */
  getPartners(params, options) {
    return this.get('/company/partners', params, options)
  }
}

export const companyApi = new CompanyApiClient()
