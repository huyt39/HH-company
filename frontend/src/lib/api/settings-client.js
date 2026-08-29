import { BaseApiClient } from './base-client'

/** Company profile and contact info: two singleton records, edited with PUT. */
class SettingsApiClient extends BaseApiClient {
  constructor() {
    super({ requireAuth: true })
  }

  getProfile() {
    return this.get('/admin/settings/profile')
  }

  saveProfile(body) {
    return this.put('/admin/settings/profile', body)
  }

  getContactInfo() {
    return this.get('/admin/settings/contact-info')
  }

  saveContactInfo(body) {
    return this.put('/admin/settings/contact-info', body)
  }
}

export const settingsApi = new SettingsApiClient()
