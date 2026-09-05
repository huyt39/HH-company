import { BaseApiClient } from './base-client'

/** Construction services (stored as `business_fields`). */
class FieldsApiClient extends BaseApiClient {
  getFields(options) {
    return this.get('/fields', undefined, options)
  }

  getField(slug, options) {
    return this.get(`/fields/${slug}`, undefined, options)
  }
}

export const fieldsApi = new FieldsApiClient()
