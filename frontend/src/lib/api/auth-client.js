import { BaseApiClient } from './base-client'

/** Admin sign-in and account. */
class AuthApiClient extends BaseApiClient {
  constructor() {
    super({ requireAuth: true })
  }

  /** Backend uses `OAuth2PasswordRequestForm`: form-urlencoded, email in `username`. */
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      form: { username: email, password },
      // A 401 here means bad credentials, not an expired session.
      skipAuthRedirect: true,
    })
  }

  me() {
    return this.get('/auth/me')
  }

  changePassword(currentPassword, newPassword) {
    return this.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
  }
}

export const authApi = new AuthApiClient()
