/** Form config for the two singleton records: company profile and contact info. */

export const CONTACT_INFO_FIELDS = [
  { name: 'address', label: 'Địa chỉ', type: 'textarea', rows: 3 },
  { name: 'phone', label: 'Điện thoại', type: 'text' },
  { name: 'fax', label: 'Fax', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'tax_code', label: 'Mã số thuế', type: 'text' },
  {
    name: 'map_embed_url',
    label: 'Link nhúng Google Maps',
    type: 'text',
    hint: 'Lấy từ Google Maps → Chia sẻ → Nhúng bản đồ, dán phần src của thẻ iframe',
  },
]

export const COMPANY_PROFILE_FIELDS = [
  { name: 'name', label: 'Tên công ty (tiếng Việt)', type: 'text', required: true },
  { name: 'name_en', label: 'Tên tiếng Anh', type: 'text' },
  { name: 'short_name', label: 'Tên viết tắt', type: 'text' },
  { name: 'tagline', label: 'Khẩu hiệu / mô tả ngắn', type: 'textarea', rows: 2 },
  { name: 'tax_code', label: 'Mã số doanh nghiệp', type: 'text' },
  { name: 'established', label: 'Năm thành lập', type: 'text' },
  { name: 'charter_capital', label: 'Vốn điều lệ', type: 'text' },
  { name: 'status', label: 'Tình trạng hoạt động', type: 'text' },
  { name: 'employees', label: 'Quy mô nhân sự', type: 'text' },
  { name: 'main_business_line', label: 'Ngành nghề chính', type: 'text' },
  { name: 'business_lines_count', label: 'Số ngành nghề đăng ký', type: 'number' },
  { name: 'vision', label: 'Tầm nhìn', type: 'textarea', rows: 4 },
  { name: 'mission', label: 'Sứ mệnh', type: 'textarea', rows: 4 },
]

/** Nested sub-tables of the company profile. */
export const COMPANY_PROFILE_REPEATERS = [
  {
    name: 'leaders',
    label: 'Ban lãnh đạo',
    columns: [
      { name: 'name', label: 'Họ tên' },
      { name: 'title', label: 'Chức danh' },
    ],
  },
  {
    name: 'org_units',
    label: 'Cơ cấu tổ chức',
    hint: 'Dòng đầu tiên là cấp cao nhất, các dòng sau là phòng ban trực thuộc.',
    columns: [
      { name: 'name', label: 'Tên đơn vị' },
      { name: 'name_en', label: 'Tên tiếng Anh' },
      { name: 'children', label: 'Đơn vị con', type: 'list' },
    ],
  },
  {
    name: 'capability_stats',
    label: 'Số liệu năng lực',
    hint: 'Bốn con số hiện ở đầu trang chủ và trang Năng lực nhà thầu.',
    columns: [
      { name: 'value', label: 'Con số' },
      { name: 'label', label: 'Nhãn (tiếng Việt)' },
      { name: 'label_en', label: 'Nhãn (tiếng Anh)' },
    ],
  },
  {
    name: 'personnel',
    label: 'Nhân sự thi công',
    hint: 'Các vị trí công ty bố trí tại công trường, hiện ở trang Năng lực nhà thầu.',
    columns: [
      { name: 'title', label: 'Vị trí' },
      { name: 'note', label: 'Ghi chú (không bắt buộc)' },
    ],
  },
  {
    name: 'milestones',
    label: 'Lịch sử phát triển',
    columns: [
      { name: 'year', label: 'Năm', type: 'number' },
      { name: 'title', label: 'Sự kiện' },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
    ],
  },
]
