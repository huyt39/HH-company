/** Single source for the site menu: header, mobile menu and footer. */
export const SITE_NAVIGATION = [
  { label: 'Trang chủ', to: '/' },
  {
    label: 'Giới thiệu',
    to: '/gioi-thieu',
    children: [
      { label: 'Tổng quan', to: '/gioi-thieu' },
      { label: 'Tầm nhìn - Sứ mệnh', to: '/gioi-thieu#tam-nhin' },
      { label: 'Ban lãnh đạo', to: '/gioi-thieu#lanh-dao' },
      { label: 'Cơ cấu tổ chức', to: '/gioi-thieu#co-cau' },
      { label: 'Lịch sử phát triển', to: '/gioi-thieu#lich-su' },
    ],
  },
  { label: 'Lĩnh vực hoạt động', to: '/linh-vuc' },
  { label: 'Sản phẩm', to: '/san-pham' },
  { label: 'Dự án', to: '/du-an' },
  { label: 'Năng lực tài chính', to: '/nang-luc-tai-chinh' },
  { label: 'Tin tức', to: '/tin-tuc' },
  { label: 'Tuyển dụng', to: '/tuyen-dung' },
  { label: 'Liên hệ', to: '/lien-he' },
]

/** The two link columns in the footer. */
export const FOOTER_LINK_GROUPS = [
  {
    title: 'Về chúng tôi',
    links: [
      { label: 'Giới thiệu', to: '/gioi-thieu' },
      { label: 'Lĩnh vực hoạt động', to: '/linh-vuc' },
      { label: 'Sản phẩm', to: '/san-pham' },
      { label: 'Dự án tiêu biểu', to: '/du-an' },
    ],
  },
  {
    title: 'Liên kết',
    links: [
      { label: 'Năng lực tài chính', to: '/nang-luc-tai-chinh' },
      { label: 'Tin tức', to: '/tin-tuc' },
      { label: 'Tuyển dụng', to: '/tuyen-dung' },
      { label: 'Liên hệ', to: '/lien-he' },
    ],
  },
]
