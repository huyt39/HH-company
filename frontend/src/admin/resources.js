/**
 * Cấu hình cho các trang CRUD.
 *
 * Mỗi tài nguyên khai báo: cột hiển thị trong bảng + danh sách trường của form.
 * `ResourcePage` đọc cấu hình này để dựng giao diện, nên thêm trường mới chỉ cần
 * sửa ở đây (và thêm cột tương ứng ở backend).
 *
 * Kiểu trường: text | textarea | html | number | date | select | list | switch
 */

const publishFields = [
  { name: 'sort_order', label: 'Thứ tự hiển thị', type: 'number', hint: 'Số nhỏ hiện trước' },
  { name: 'is_published', label: 'Hiển thị trên web', type: 'switch', default: true },
]

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'in_progress', label: 'Đang triển khai' },
  { value: 'planning', label: 'Chuẩn bị đầu tư' },
]

export const resources = {
  fields: {
    label: 'Lĩnh vực hoạt động',
    singular: 'lĩnh vực',
    searchable: true,
    columns: [
      { name: 'name', label: 'Tên lĩnh vực', primary: true },
      { name: 'slug', label: 'Slug', mono: true },
      { name: 'icon', label: 'Icon', width: 60 },
    ],
    form: [
      { name: 'name', label: 'Tên lĩnh vực', type: 'text', required: true, slugSource: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, mono: true },
      { name: 'description', label: 'Mô tả', type: 'textarea', rows: 4 },
      { name: 'icon', label: 'Ký tự icon', type: 'text', hint: 'Ví dụ: ◆ ◇ ▣ ⚙' },
      { name: 'cover', label: 'Ảnh minh hoạ', type: 'image' },
      ...publishFields,
    ],
  },

  products: {
    label: 'Sản phẩm',
    singular: 'nhóm sản phẩm',
    searchable: true,
    columns: [
      { name: 'name', label: 'Nhóm sản phẩm', primary: true },
      { name: 'slug', label: 'Slug', mono: true },
      { name: 'icon', label: 'Icon', width: 60 },
    ],
    form: [
      { name: 'name', label: 'Tên nhóm sản phẩm', type: 'text', required: true, slugSource: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, mono: true },
      { name: 'description', label: 'Mô tả', type: 'textarea', rows: 4 },
      { name: 'specs', label: 'Thông số / chủng loại', type: 'list' },
      { name: 'applications', label: 'Ứng dụng', type: 'list' },
      { name: 'icon', label: 'Ký tự icon', type: 'text' },
      ...publishFields,
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
      { name: 'location', label: 'Địa điểm' },
      { name: 'status', label: 'Trạng thái', options: STATUS_OPTIONS, width: 130 },
    ],
    form: [
      { name: 'name', label: 'Tên dự án', type: 'text', required: true, slugSource: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, mono: true },
      { name: 'year', label: 'Năm thực hiện', type: 'number' },
      { name: 'status', label: 'Trạng thái', type: 'select', options: STATUS_OPTIONS },
      { name: 'location', label: 'Địa điểm', type: 'text' },
      { name: 'investor', label: 'Khách hàng / nhà thầu', type: 'textarea', rows: 2 },
      { name: 'scale', label: 'Phạm vi cung cấp', type: 'textarea', rows: 4 },
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
      ...publishFields,
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
      { name: 'published_at', label: 'Ngày đăng', width: 120 },
    ],
    form: [
      { name: 'title', label: 'Tiêu đề', type: 'text', required: true, slugSource: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, mono: true },
      { name: 'category', label: 'Chuyên mục', type: 'text' },
      { name: 'published_at', label: 'Ngày đăng', type: 'date' },
      { name: 'excerpt', label: 'Tóm tắt', type: 'textarea', rows: 3 },
      { name: 'content', label: 'Nội dung (HTML)', type: 'html', rows: 12 },
      { name: 'cover', label: 'Ảnh bìa', type: 'image' },
      ...publishFields,
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
      { name: 'deadline', label: 'Hạn nộp', width: 120 },
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
      ...publishFields,
    ],
  },

  financials: {
    label: 'Số liệu tài chính',
    singular: 'năm tài chính',
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
      { name: 'is_published', label: 'Hiển thị trên web', type: 'switch', default: true },
    ],
  },

  partners: {
    label: 'Khách hàng & đối tác',
    singular: 'đối tác',
    searchable: true,
    columns: [
      { name: 'name', label: 'Tên đơn vị', primary: true },
      { name: 'country', label: 'Quốc gia', width: 140 },
      {
        name: 'role',
        label: 'Vai trò',
        width: 150,
        options: [
          { value: 'customer', label: 'Khách hàng' },
          { value: 'manufacturer', label: 'Nhà sản xuất' },
        ],
      },
    ],
    form: [
      { name: 'name', label: 'Tên đơn vị', type: 'text', required: true },
      { name: 'country', label: 'Quốc gia', type: 'text' },
      {
        name: 'role',
        label: 'Vai trò',
        type: 'select',
        options: [
          { value: 'customer', label: 'Khách hàng' },
          { value: 'manufacturer', label: 'Nhà sản xuất' },
        ],
      },
      ...publishFields,
    ],
  },
}

/** Chuyển tiếng Việt có dấu thành slug: "Cầu Móng Sến" -> "cau-mong-sen". */
export function slugify(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}
