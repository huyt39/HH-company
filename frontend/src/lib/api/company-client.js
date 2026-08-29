import { BaseApiClient } from './base-client'

/** Company profile, contact info, financials and partners. */
class CompanyApiClient extends BaseApiClient {
  getProfile(options) {
    return this.get('/company/profile', undefined, options)
  }

  getContactInfo(options) {
    return this.get('/company/contact-info', undefined, options)
  }

  getFinancials(options) {
    return this.get('/company/financials', undefined, options)
  }

  /** @param {{role?: 'customer' | 'manufacturer'}} [params] */
  getPartners(params, options) {
    return this.get('/company/partners', params, options)
  }
}

export const companyApi = new CompanyApiClient()
