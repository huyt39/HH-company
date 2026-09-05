import { PROJECT_STATUS_OPTIONS } from './project-status'
import { PROJECT_ROLE_OPTIONS, SERVICE_CATEGORY_OPTIONS } from './services'

/**
 * Config for the admin CRUD pages: each resource declares its table columns and
 * form fields, and `ResourcePage` builds the UI from it — adding a field means
 * editing this file (plus the matching backend column).
 *
 * Field types: text | textarea | html | number | date | select | list | switch |
 * image | gallery
 */

const PUBLISH_FIELDS = [
  { name: 'sort_order', label: 'Thứ tự hiển thị', type: 'number', hint: 'Số nhỏ hiện trước' },
  { name: 'is_published', label: 'Hiển thị trên web', type: 'switch', default: true },
]

const CERTIFICATE_CATEGORY_OPTIONS = [
  { value: 'legal', label: 'Pháp lý & năng lực hoạt động' },
  { value: 'iso', label: 'Hệ thống quản lý (ISO)' },
  { value: 'product', label: 'Chứng chỉ sản phẩm' },
  { value: 'acceptance', label: 'Thư chấp thuận của chủ đầu tư / TVGS' },
]

const EQUIPMENT_CATEGORY_OPTIONS = [
  { value: 'cang-keo', label: 'Căng kéo dự ứng lực' },
  { value: 'nang-ha', label: 'Nâng hạ & giàn thao tác' },
  { value: 'do-kiem', label: 'Đo đạc & kiểm định' },
  { value: 'khac', label: 'Khác' },
]

const DOCUMENT_CATEGORY_OPTIONS = [
  { value: 'profile', label: 'Hồ sơ năng lực' },
  { value: 'catalogue', label: 'Catalogue sản phẩm' },
  { value: 'method', label: 'Biện pháp thi công mẫu' },
  { value: 'certificate', label: 'Chứng chỉ' },
]

const PARTNER_ROLE_OPTIONS = [
  { value: 'customer', label: 'Khách hàng' },
  { value: 'manufacturer', label: 'Nhà sản xuất' },
]

export const ADMIN_RESOURCES = {
  fields: {
    label: 'Dịch vụ thi công',
    singular: 'dịch vụ',
    searchable: true,
    columns: [
      { name: 'name', label: 'Tên dịch vụ', primary: true },
      { name: 'category', label: 'Nhóm', options: SERVICE_CATEGORY_OPTIONS, width: 170 },
      { name: 'slug', label: 'Slug', mono: true },
      { name: 'icon', label: 'Icon', width: 60 },
    ],
    form: [
      { name: 'name', label: 'Tên dịch vụ', type: 'text', required: true, slugSource: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, mono: true },
      {
        name: 'category',
        label: 'Nhóm dịch vụ',
        type: 'select',
        options: SERVICE_CATEGORY_OPTIONS,
        hint: 'Quyết định dịch vụ nằm ở khối nào trên trang Dịch vụ thi công',
      },
      { name: 'summary', label: 'Mô tả ngắn (hiện ở thẻ dịch vụ)', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Mô tả đầy đủ', type: 'textarea', rows: 5 },
      {
        name: 'process_steps',
        label: 'Quy trình thi công',
        type: 'list',
        rows: 8,
        hint: 'Mỗi dòng là một bước, hiện theo thứ tự đánh số',
      },
      { name: 'standards', label: 'Tiêu chuẩn áp dụng', type: 'list', rows: 4 },
      { name: 'deliverables', label: 'Hồ sơ bàn giao', type: 'list', rows: 6 },
      {
        name: 'work_type',
        label: 'Mã loại công việc',
        type: 'text',
        mono: true,
        hint: 'Khớp với "Loại công việc" ở Dự án để trang dịch vụ tự lấy dự án liên quan. Thường trùng slug.',
      },
      { name: 'icon', label: 'Ký tự icon', type: 'text', hint: 'Ví dụ: ◆ ◇ ▣ ⚙' },
      { name: 'cover', label: 'Ảnh minh hoạ', type: 'image' },
      ...PUBLISH_FIELDS,
    ],
  },

  products: {
    label: 'Sản phẩm',
    singular: 'nhóm sản phẩm',
    searchable: true,
    columns: [
      { name: 'image', label: '', type: 'thumb', width: 64 },
      { name: 'name', label: 'Nhóm sản phẩm', primary: true },
      { name: 'slug', label: 'Slug', mono: true },
      { name: 'icon', label: 'Icon', width: 60 },
    ],
    form: [
      { name: 'name', label: 'Tên nhóm sản phẩm', type: 'text', required: true, slugSource: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, mono: true },
      { name: 'description', label: 'Mô tả', type: 'textarea', rows: 4 },
      {
        name: 'image',
        label: 'Ảnh minh hoạ',
        type: 'image',
        hint: 'Hiện cạnh mô tả ở trang Sản phẩm, cắt theo khung 16:9',
      },
      { name: 'specs', label: 'Thông số / chủng loại', type: 'list' },
      { name: 'applications', label: 'Ứng dụng', type: 'list' },
      { name: 'icon', label: 'Ký tự icon', type: 'text' },
      ...PUBLISH_FIELDS,
    ],
  },

  projects: {
    label: 'Dự án',
    singular: 'dự án',
    searchable: true,
    columns: [
      { name: 'cover', label: '', type: 'thumb', width: 64 },
      { name: 'name', label: 'Tên dự án', primary: true },
      { name: 'year', label: 'Năm', width: 70 },
      { name: 'role', label: 'Vai trò', options: PROJECT_ROLE_OPTIONS, width: 110 },
      { name: 'location', label: 'Địa điểm' },
      { name: 'status', label: 'Trạng thái', options: PROJECT_STATUS_OPTIONS, width: 130 },
    ],
    form: [
      { name: 'name', label: 'Tên dự án', type: 'text', required: true, slugSource: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, mono: true },
      { name: 'year', label: 'Năm thực hiện', type: 'number' },
      { name: 'status', label: 'Trạng thái', type: 'select', options: PROJECT_STATUS_OPTIONS },
      {
        name: 'role',
        label: 'Vai trò của Hòa Hoàng',
        type: 'select',
        options: PROJECT_ROLE_OPTIONS,
        hint: 'Chọn "Thi công" khi công ty trực tiếp lắp đặt / căng kéo, "Cung cấp" khi chỉ bán vật tư',
      },
      {
        name: 'work_types',
        label: 'Loại công việc',
        type: 'list',
        rows: 3,
        hint: 'Mỗi dòng là mã của một dịch vụ (xem "Mã loại công việc" ở mục Dịch vụ thi công)',
      },
      { name: 'structure_type', label: 'Loại kết cấu', type: 'text', hint: 'Ví dụ: Cầu dây văng, Cầu vòm, Cầu cạn' },
      { name: 'location', label: 'Địa điểm', type: 'text' },
      { name: 'investor', label: 'Khách hàng / nhà thầu', type: 'textarea', rows: 2 },
      { name: 'scale', label: 'Phạm vi công việc', type: 'textarea', rows: 4 },
      { name: 'summary', label: 'Tóm tắt (hiện ở thẻ dự án)', type: 'textarea', rows: 3 },
      { name: 'content', label: 'Nội dung chi tiết (HTML)', type: 'html', rows: 8 },
      {
        name: 'context',
        label: 'Bối cảnh dự án',
        type: 'textarea',
        rows: 5,
        hint: 'Thông tin từ nguồn công khai, hiển thị trong khung riêng',
      },
      { name: 'context_source', label: 'Link nguồn bối cảnh', type: 'text' },
      { name: 'cover', label: 'Ảnh bìa', type: 'image', hint: 'Hiện ở thẻ dự án và đầu trang chi tiết' },
      { name: 'gallery', label: 'Thư viện ảnh', type: 'gallery' },
      ...PUBLISH_FIELDS,
    ],
  },

  news: {
    label: 'Tin tức',
    singular: 'bài viết',
    searchable: true,
    columns: [
      { name: 'cover', label: '', type: 'thumb', width: 64 },
      { name: 'title', label: 'Tiêu đề', primary: true },
      { name: 'category', label: 'Chuyên mục', width: 150 },
      { name: 'published_at', label: 'Ngày đăng', type: 'date', width: 120 },
    ],
    form: [
      { name: 'title', label: 'Tiêu đề', type: 'text', required: true, slugSource: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, mono: true },
      { name: 'category', label: 'Chuyên mục', type: 'text' },
      { name: 'published_at', label: 'Ngày đăng', type: 'date' },
      { name: 'excerpt', label: 'Tóm tắt', type: 'textarea', rows: 3 },
      { name: 'content', label: 'Nội dung (HTML)', type: 'html', rows: 12 },
      { name: 'cover', label: 'Ảnh bìa', type: 'image' },
      ...PUBLISH_FIELDS,
    ],
  },

  careers: {
    label: 'Tuyển dụng',
    singular: 'vị trí',
    searchable: true,
    columns: [
      { name: 'title', label: 'Vị trí', primary: true },
      { name: 'department', label: 'Bộ phận' },
      { name: 'quantity', label: 'SL', width: 60 },
      { name: 'deadline', label: 'Hạn nộp', type: 'date', width: 120 },
    ],
    form: [
      { name: 'title', label: 'Tên vị trí', type: 'text', required: true, slugSource: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, mono: true },
      { name: 'department', label: 'Bộ phận', type: 'text' },
      { name: 'location', label: 'Nơi làm việc', type: 'text' },
      { name: 'employment_type', label: 'Hình thức', type: 'text', hint: 'Toàn thời gian, bán thời gian…' },
      { name: 'quantity', label: 'Số lượng', type: 'number', default: 1 },
      { name: 'deadline', label: 'Hạn nộp hồ sơ', type: 'date' },
      { name: 'description', label: 'Mô tả công việc (HTML)', type: 'html', rows: 12 },
      ...PUBLISH_FIELDS,
    ],
  },

  // Not published anywhere on the public site — kept so the capability profile
  // handed over with a bid can be produced from one place.
  financials: {
    label: 'Số liệu tài chính',
    singular: 'năm tài chính',
    note: 'Số liệu này KHÔNG hiển thị trên website. Chỉ dùng để lập hồ sơ năng lực khi dự thầu.',
    pk: 'year',
    sortable: false,
    columns: [
      { name: 'year', label: 'Năm', primary: true, width: 90 },
      { name: 'revenue', label: 'Doanh thu', money: true },
      { name: 'profit_after_tax', label: 'LNST', money: true },
      { name: 'total_assets', label: 'Tổng tài sản', money: true },
      { name: 'equity', label: 'Vốn chủ sở hữu', money: true },
    ],
    form: [
      { name: 'year', label: 'Năm', type: 'number', required: true, lockOnEdit: true },
      { name: 'revenue', label: 'Doanh thu thuần (VNĐ)', type: 'number' },
      { name: 'profit_after_tax', label: 'Lợi nhuận sau thuế (VNĐ)', type: 'number' },
      { name: 'total_assets', label: 'Tổng tài sản (VNĐ)', type: 'number' },
      { name: 'equity', label: 'Vốn chủ sở hữu (VNĐ)', type: 'number' },
    ],
  },

  certificates: {
    label: 'Chứng chỉ & hồ sơ pháp lý',
    singular: 'chứng chỉ',
    searchable: true,
    columns: [
      { name: 'name', label: 'Tên chứng chỉ', primary: true },
      { name: 'category', label: 'Nhóm', options: CERTIFICATE_CATEGORY_OPTIONS, width: 190 },
      { name: 'code', label: 'Số hiệu', mono: true, width: 160 },
      { name: 'issued', label: 'Ngày cấp' },
    ],
    form: [
      { name: 'name', label: 'Tên chứng chỉ', type: 'text', required: true },
      {
        name: 'category',
        label: 'Nhóm',
        type: 'select',
        options: CERTIFICATE_CATEGORY_OPTIONS,
        hint: 'Quyết định khối hiển thị trên trang Năng lực nhà thầu',
      },
      { name: 'issuer', label: 'Đơn vị cấp', type: 'text' },
      { name: 'code', label: 'Số hiệu', type: 'text', mono: true },
      { name: 'issued', label: 'Ngày cấp / hiệu lực', type: 'text', hint: 'Ví dụ: 16/12/2025, hoặc "Còn hiệu lực đến 2027"' },
      { name: 'note', label: 'Ghi chú', type: 'textarea', rows: 3 },
      { name: 'image', label: 'Ảnh chụp chứng chỉ', type: 'image' },
      ...PUBLISH_FIELDS,
    ],
  },

  equipment: {
    label: 'Thiết bị thi công',
    singular: 'thiết bị',
    searchable: true,
    columns: [
      { name: 'name', label: 'Tên thiết bị', primary: true },
      { name: 'category', label: 'Nhóm', options: EQUIPMENT_CATEGORY_OPTIONS, width: 160 },
      { name: 'quantity', label: 'SL', width: 60 },
    ],
    form: [
      { name: 'name', label: 'Tên thiết bị', type: 'text', required: true },
      { name: 'category', label: 'Nhóm thiết bị', type: 'select', options: EQUIPMENT_CATEGORY_OPTIONS },
      { name: 'spec', label: 'Thông số / công suất', type: 'textarea', rows: 2 },
      { name: 'quantity', label: 'Số lượng', type: 'number', hint: 'Để trống thì trang web hiện "Đang cập nhật"' },
      { name: 'unit', label: 'Đơn vị', type: 'text', hint: 'Bộ, chiếc, máy…' },
      { name: 'note', label: 'Ghi chú', type: 'textarea', rows: 2 },
      { name: 'image', label: 'Ảnh thiết bị', type: 'image' },
      ...PUBLISH_FIELDS,
    ],
  },

  documents: {
    label: 'Tài liệu tải về',
    singular: 'tài liệu',
    searchable: true,
    columns: [
      { name: 'title', label: 'Tên tài liệu', primary: true },
      { name: 'category', label: 'Nhóm', options: DOCUMENT_CATEGORY_OPTIONS, width: 170 },
      { name: 'language', label: 'Ngôn ngữ', width: 100 },
    ],
    form: [
      { name: 'title', label: 'Tên tài liệu', type: 'text', required: true },
      { name: 'category', label: 'Nhóm tài liệu', type: 'select', options: DOCUMENT_CATEGORY_OPTIONS },
      { name: 'description', label: 'Mô tả ngắn', type: 'textarea', rows: 2 },
      {
        name: 'file_url',
        label: 'Đường dẫn file',
        type: 'text',
        mono: true,
        hint: 'Dán link file PDF đã tải lên, hoặc link Google Drive chia sẻ công khai',
      },
      { name: 'language', label: 'Ngôn ngữ', type: 'text', hint: 'VI, EN hoặc VI–EN' },
      { name: 'size_label', label: 'Dung lượng', type: 'text', hint: 'Ví dụ: PDF · 12 MB' },
      { name: 'cover', label: 'Ảnh bìa', type: 'image' },
      ...PUBLISH_FIELDS,
    ],
  },

  partners: {
    label: 'Khách hàng & đối tác',
    singular: 'đối tác',
    searchable: true,
    columns: [
      { name: 'logo', label: '', type: 'thumb', width: 64 },
      { name: 'name', label: 'Tên đơn vị', primary: true },
      { name: 'country', label: 'Quốc gia', width: 140 },
      { name: 'role', label: 'Vai trò', width: 150, options: PARTNER_ROLE_OPTIONS },
    ],
    form: [
      { name: 'name', label: 'Tên đơn vị', type: 'text', required: true },
      { name: 'country', label: 'Quốc gia', type: 'text' },
      { name: 'role', label: 'Vai trò', type: 'select', options: PARTNER_ROLE_OPTIONS },
      {
        name: 'logo',
        label: 'Logo',
        type: 'image',
        hint: 'Để trống thì hiện tên đơn vị dạng chữ như hiện tại',
      },
      ...PUBLISH_FIELDS,
    ],
  },
}
