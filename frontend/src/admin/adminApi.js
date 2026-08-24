const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
const TOKEN_KEY = 'hh_admin_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class AdminApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
  }
}

/** Đọc thông báo lỗi từ response, gộp cả lỗi validation 422 của FastAPI. */
async function readError(res) {
  try {
    const data = await res.json()
    if (typeof data?.detail === 'string') return data.detail
    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((e) => `${e.loc?.slice(1).join('.') || 'dữ liệu'}: ${e.msg}`)
        .join('; ')
    }
  } catch {
    /* không phải JSON */
  }
  return `Yêu cầu thất bại (${res.status})`
}

async function request(path, { method = 'GET', body, params, form, signal } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const token = tokenStore.get()
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json'
  if (form) headers['Content-Type'] = 'application/x-www-form-urlencoded'

  const res = await fetch(url, {
    method,
    headers,
    signal,
    body: body ? JSON.stringify(body) : form ? new URLSearchParams(form).toString() : undefined,
  })

  if (res.status === 401) {
    tokenStore.clear()
    // Buộc quay lại màn đăng nhập khi token hết hạn giữa chừng.
    if (!window.location.pathname.endsWith('/admin/login')) {
      window.location.assign('/admin/login')
    }
    throw new AdminApiError('Phiên đăng nhập đã hết hạn', 401)
  }
  if (!res.ok) throw new AdminApiError(await readError(res), res.status)

  return res.status === 204 ? null : res.json()
}

async function upload(file) {
  const body = new FormData()
  body.append('file', file)

  const token = tokenStore.get()
  const res = await fetch(`${BASE_URL}/admin/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body, // để trình duyệt tự đặt Content-Type kèm boundary
  })
  if (!res.ok) throw new AdminApiError(await readError(res), res.status)
  return res.json()
}

export const adminApi = {
  uploadImage: upload,
  login: (email, password) =>
    request('/auth/login', { method: 'POST', form: { username: email, password } }),
  me: () => request('/auth/me'),
  changePassword: (current_password, new_password) =>
    request('/auth/change-password', { method: 'POST', body: { current_password, new_password } }),

  // CRUD chung cho 7 tài nguyên
  list: (resource, params) => request(`/admin/${resource}`, { params }),
  create: (resource, body) => request(`/admin/${resource}`, { method: 'POST', body }),
  update: (resource, id, body) => request(`/admin/${resource}/${id}`, { method: 'PATCH', body }),
  remove: (resource, id) => request(`/admin/${resource}/${id}`, { method: 'DELETE' }),
  reorder: (resource, ids) =>
    request(`/admin/${resource}/reorder`, { method: 'POST', body: { ids } }),

  getProfile: () => request('/admin/settings/profile'),
  saveProfile: (body) => request('/admin/settings/profile', { method: 'PUT', body }),
  getContactInfo: () => request('/admin/settings/contact-info'),
  saveContactInfo: (body) => request('/admin/settings/contact-info', { method: 'PUT', body }),

  listImages: () => request('/admin/uploads'),
  deleteImage: (filename) => request(`/admin/uploads/${filename}`, { method: 'DELETE' }),

  listMessages: (params) => request('/admin/messages', { params }),
  unreadCount: () => request('/admin/messages/unread-count'),
  markMessage: (id, is_read) =>
    request(`/admin/messages/${id}`, { method: 'PATCH', body: { is_read } }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),
}
