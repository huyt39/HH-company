import { BaseApiClient } from './base-client'

/** Public contact form. */
class ContactApiClient extends BaseApiClient {
  /** @param {{full_name: string, email: string, phone?: string|null, subject?: string|null, message: string}} payload */
  submitMessage(payload) {
    return this.post('/contact', payload)
  }
}

export const contactApi = new ContactApiClient()
