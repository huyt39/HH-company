import { BaseApiClient } from './base-client'

/** Business fields. */
class FieldsApiClient extends BaseApiClient {
  getFields(options) {
    return this.get('/fields', undefined, options)
  }
}

export const fieldsApi = new FieldsApiClient()
