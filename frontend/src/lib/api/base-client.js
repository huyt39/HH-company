import { clearToken, getToken } from '@/lib/auth/token-storage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
const LOGIN_PATH = '/admin/login'

/** API error, always carrying the HTTP status. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Build the query string, skipping empty values. */
function buildUrl(baseUrl, path, params) {
  const url = new URL(`${baseUrl}${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      url.searchParams.set(key, value)
    })
  }
  return url
}

/**
 * Unwrap the backend envelope `{ success, detail, data }` down to `data`.
 * Anything without that shape (e.g. `/health`) is returned untouched.
 */
function unwrap(payload) {
  const isEnvelope =
    payload !== null && typeof payload === 'object' && 'success' in payload && 'data' in payload
  return isEnvelope ? payload.data : payload
}

/**
 * Read the error message off a failed response. Validation failures carry the
 * per-field details in `data.validation_errors`; everything else has a plain
 * `detail` string.
 */
async function readErrorMessage(response) {
  try {
    const payload = await response.json()
    const fieldErrors = payload?.data?.validation_errors
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      return fieldErrors
        .map((item) => `${item.loc?.slice(1).join('.') || 'dữ liệu'}: ${item.msg}`)
        .join('; ')
    }
    if (typeof payload?.detail === 'string') return payload.detail
  } catch {
    /* not JSON — fall back to the default message */
  }
  return `Yêu cầu thất bại (${response.status})`
}

/**
 * Shared HTTP client. Each endpoint group subclasses it in `lib/api/` and
 * exports a single instance, so URL, header, error and token handling live
 * in one place.
 *
 * Pass `requireAuth: true` for authenticated clients: the token is attached
 * automatically and a 401 sends the user back to the sign-in screen.
 */
export class BaseApiClient {
  constructor({ requireAuth = false, baseUrl = BASE_URL } = {}) {
    this.baseUrl = baseUrl
    this.requireAuth = requireAuth
  }

  /**
   * @param {string} path path after BASE_URL, e.g. `/projects`
   * @param {{method?: string, body?: object, form?: object, params?: object,
   *          signal?: AbortSignal, skipAuthRedirect?: boolean}} [options]
   */
  async request(path, options = {}) {
    const { method = 'GET', body, form, params, signal, skipAuthRedirect = false } = options

    const headers = {}
    const token = this.requireAuth ? getToken() : null
    if (token) headers.Authorization = `Bearer ${token}`
    if (body) headers['Content-Type'] = 'application/json'
    if (form) headers['Content-Type'] = 'application/x-www-form-urlencoded'

    const response = await fetch(buildUrl(this.baseUrl, path, params), {
      method,
      headers,
      signal,
      body: body ? JSON.stringify(body) : form ? new URLSearchParams(form).toString() : undefined,
    })

    // Expired token: send the user back to sign-in. `skipAuthRedirect` is for
    // the sign-in call itself, where a 401 just means bad credentials.
    if (this.requireAuth && response.status === 401 && !skipAuthRedirect) {
      this.handleAuthFailure()
      throw new ApiError('Phiên đăng nhập đã hết hạn', 401)
    }

    if (!response.ok) throw new ApiError(await readErrorMessage(response), response.status)

    return response.status === 204 ? null : unwrap(await response.json())
  }

  handleAuthFailure() {
    clearToken()
    if (!window.location.pathname.startsWith(LOGIN_PATH)) window.location.assign(LOGIN_PATH)
  }

  get(path, params, options) {
    return this.request(path, { ...options, method: 'GET', params })
  }

  post(path, body, options) {
    return this.request(path, { ...options, method: 'POST', body })
  }

  put(path, body, options) {
    return this.request(path, { ...options, method: 'PUT', body })
  }

  patch(path, body, options) {
    return this.request(path, { ...options, method: 'PATCH', body })
  }

  delete(path, options) {
    return this.request(path, { ...options, method: 'DELETE' })
  }

  /** Send multipart/form-data; the browser sets Content-Type with the boundary. */
  async postFormData(path, formData) {
    const token = this.requireAuth ? getToken() : null
    const response = await fetch(buildUrl(this.baseUrl, path), {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    if (!response.ok) throw new ApiError(await readErrorMessage(response), response.status)
    return unwrap(await response.json())
  }
}
