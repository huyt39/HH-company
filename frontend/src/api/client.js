const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, params, signal } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const res = await fetch(url, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let detail = `Yêu cầu thất bại (${res.status})`
    try {
      const data = await res.json()
      if (data?.detail) detail = typeof data.detail === 'string' ? data.detail : detail
    } catch {
      /* body không phải JSON — giữ thông báo mặc định */
    }
    throw new ApiError(detail, res.status)
  }

  return res.status === 204 ? null : res.json()
}

export const api = {
  getProfile: (opts) => request('/company/profile', opts),
  getContactInfo: (opts) => request('/company/contact-info', opts),
  getFields: (opts) => request('/fields', opts),
  getProducts: (opts) => request('/products', opts),
  getProduct: (slug, opts) => request(`/products/${slug}`, opts),
  getFinancials: (opts) => request('/company/financials', opts),
  getPartners: (params, opts) => request('/company/partners', { ...opts, params }),
  getProjects: (params, opts) => request('/projects', { ...opts, params }),
  getProject: (slug, opts) => request(`/projects/${slug}`, opts),
  getNews: (params, opts) => request('/news', { ...opts, params }),
  getNewsItem: (slug, opts) => request(`/news/${slug}`, opts),
  getJobs: (params, opts) => request('/careers', { ...opts, params }),
  getJob: (slug, opts) => request(`/careers/${slug}`, opts),
  submitContact: (payload) => request('/contact', { method: 'POST', body: payload }),
}

export { ApiError }
