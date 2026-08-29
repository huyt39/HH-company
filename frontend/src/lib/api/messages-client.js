import { BaseApiClient } from './base-client'

/** Inbox for contact-form submissions. */
class MessagesApiClient extends BaseApiClient {
  constructor() {
    super({ requireAuth: true })
  }

  /** @param {{unread_only?: boolean}} [params] */
  listMessages(params) {
    return this.get('/admin/messages', params)
  }

  getUnreadCount() {
    return this.get('/admin/messages/unread-count')
  }

  markRead(id, isRead) {
    return this.patch(`/admin/messages/${id}`, { is_read: isRead })
  }

  deleteMessage(id) {
    return this.delete(`/admin/messages/${id}`)
  }
}

export const messagesApi = new MessagesApiClient()
