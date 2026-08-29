import { BaseApiClient } from './base-client'

/**
 * Shared CRUD for every admin resource. The backend exposes them all under
 * `/admin/{resource}`, so one client is enough; per-resource columns and form
 * fields live in `lib/constants/admin-resources.js`.
 */
class ResourcesApiClient extends BaseApiClient {
  constructor() {
    super({ requireAuth: true })
  }

  list(resource, params) {
    return this.get(`/admin/${resource}`, params)
  }

  create(resource, body) {
    return this.post(`/admin/${resource}`, body)
  }

  update(resource, id, body) {
    return this.patch(`/admin/${resource}/${id}`, body)
  }

  remove(resource, id) {
    return this.delete(`/admin/${resource}/${id}`)
  }

  reorder(resource, ids) {
    return this.post(`/admin/${resource}/reorder`, { ids })
  }
}

export const resourcesApi = new ResourcesApiClient()
