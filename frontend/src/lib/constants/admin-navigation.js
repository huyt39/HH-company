/** Admin sidebar menu. Entries with `section` are group headings. */
export const ADMIN_NAVIGATION = [
  { section: 'Nội dung' },
  { to: '/admin/projects', label: 'Dự án' },
  { to: '/admin/products', label: 'Sản phẩm' },
  { to: '/admin/fields', label: 'Lĩnh vực hoạt động' },
  { to: '/admin/news', label: 'Tin tức' },
  { to: '/admin/careers', label: 'Tuyển dụng' },
  { section: 'Công ty' },
  { to: '/admin/profile', label: 'Hồ sơ công ty' },
  { to: '/admin/contact-info', label: 'Thông tin liên hệ' },
  { to: '/admin/financials', label: 'Số liệu tài chính' },
  { to: '/admin/partners', label: 'Khách hàng & đối tác' },
  { section: 'Khác' },
  { to: '/admin/messages', label: 'Hộp thư liên hệ', badge: 'unread' },
  { to: '/admin/account', label: 'Tài khoản' },
]

/** Record-count cards on the dashboard. */
export const ADMIN_DASHBOARD_CARDS = [
  { resource: 'projects', label: 'Dự án', to: '/admin/projects' },
  { resource: 'products', label: 'Nhóm sản phẩm', to: '/admin/products' },
  { resource: 'fields', label: 'Lĩnh vực hoạt động', to: '/admin/fields' },
  { resource: 'news', label: 'Bài viết', to: '/admin/news' },
  { resource: 'careers', label: 'Tin tuyển dụng', to: '/admin/careers' },
  { resource: 'partners', label: 'Khách hàng & đối tác', to: '/admin/partners' },
]
