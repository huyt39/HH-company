import { BaseApiClient } from './base-client'

/** Contractor capability: certificates, equipment and downloadable documents. */
class CapabilityApiClient extends BaseApiClient {
  /** @param {{category?: 'legal' | 'iso' | 'acceptance' | 'product'}} [params] */
  getCertificates(params, options) {
    return this.get('/capability/certificates', params, options)
  }

  getEquipment(options) {
    return this.get('/capability/equipment', undefined, options)
  }

  getDocuments(options) {
    return this.get('/capability/documents', undefined, options)
  }
}

export const capabilityApi = new CapabilityApiClient()
