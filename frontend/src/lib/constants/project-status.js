/** Project status, shared by the public site and the admin form so labels never drift. */
export const PROJECT_STATUS_OPTIONS = [
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'in_progress', label: 'Đang triển khai' },
  { value: 'planning', label: 'Chuẩn bị đầu tư' },
]

export const PROJECT_STATUS_LABEL = Object.fromEntries(
  PROJECT_STATUS_OPTIONS.map((option) => [option.value, option.label]),
)

/** Filters on the project list page. */
export const PROJECT_STATUS_FILTERS = [
  { value: '', label: 'Tất cả' },
  { value: 'in_progress', label: 'Đang triển khai' },
  { value: 'completed', label: 'Đã hoàn thành' },
]
