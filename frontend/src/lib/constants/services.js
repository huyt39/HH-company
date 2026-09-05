/**
 * Service taxonomy shared by the services page, the projects filter and the
 * project detail page.
 *
 * `category` groups the work the way a specialist bridge contractor's clients
 * think about it — new build, repair and strengthening, technology and supply.
 * `role` says whether Hoa Hoang built the job or only supplied the materials.
 */

export const SERVICE_CATEGORIES = ['build', 'repair', 'technology']

/** Ordered category list for admin selects; labels are Vietnamese-only there. */
export const SERVICE_CATEGORY_OPTIONS = [
  { value: 'build', label: 'Thi công mới' },
  { value: 'repair', label: 'Sửa chữa – tăng cường' },
  { value: 'technology', label: 'Công nghệ & cung cấp' },
]

export const PROJECT_ROLE_OPTIONS = [
  { value: 'construction', label: 'Thi công' },
  { value: 'supply', label: 'Cung cấp' },
]

/** Card tag colouring; matches the tones the status tags already use. */
export const PROJECT_ROLE_TONE = {
  construction: 'done',
  supply: 'planned',
}

/**
 * Work types offered as filters on the projects page. Values match both a
 * service slug and the entries in a project's `work_types`.
 */
export const PROJECT_WORK_TYPE_FILTERS = [
  'cang-keo-du-ung-luc-ngoai',
  'he-cap-cau',
  'lap-dat-goi-cau',
  'thay-the-he-cap',
  'thay-the-khe-co-gian',
  'tang-cuong-cau-cu',
  'thay-the-goi-cau',
  'cung-cap-vat-tu-thiet-bi',
]
