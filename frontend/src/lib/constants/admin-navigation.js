/** Admin sidebar menu. Entries with `section` are group headings. */
export const ADMIN_NAVIGATION = [
  { section: 'Nội dung' },
  { to: '/admin/projects', label: 'Dự án' },
  { to: '/admin/fields', label: 'Dịch vụ thi công' },
  { to: '/admin/products', label: 'Sản phẩm' },
  { to: '/admin/news', label: 'Tin tức' },
  { to: '/admin/careers', label: 'Tuyển dụng' },
  { section: 'Năng lực nhà thầu' },
  { to: '/admin/certificates', label: 'Chứng chỉ & hồ sơ pháp lý' },
  { to: '/admin/equipment', label: 'Thiết bị thi công' },
  { to: '/admin/documents', label: 'Tài liệu tải về' },
  { section: 'Công ty' },
  { to: '/admin/profile', label: 'Hồ sơ công ty' },
  { to: '/admin/contact-info', label: 'Thông tin liên hệ' },
  { to: '/admin/partners', label: 'Khách hàng & đối tác' },
  { to: '/admin/financials', label: 'Số liệu tài chính (nội bộ)' },
  { section: 'Khác' },
  { to: '/admin/messages', label: 'Hộp thư liên hệ', badge: 'unread' },
  { to: '/admin/account', label: 'Tài khoản' },
]

/** Record-count cards on the dashboard. */
export const ADMIN_DASHBOARD_CARDS = [
  { resource: 'projects', label: 'Dự án', to: '/admin/projects' },
  { resource: 'fields', label: 'Dịch vụ thi công', to: '/admin/fields' },
  { resource: 'products', label: 'Nhóm sản phẩm', to: '/admin/products' },
  { resource: 'certificates', label: 'Chứng chỉ', to: '/admin/certificates' },
  { resource: 'equipment', label: 'Thiết bị thi công', to: '/admin/equipment' },
  { resource: 'news', label: 'Bài viết', to: '/admin/news' },
  { resource: 'careers', label: 'Tin tuyển dụng', to: '/admin/careers' },
  { resource: 'partners', label: 'Khách hàng & đối tác', to: '/admin/partners' },
]
