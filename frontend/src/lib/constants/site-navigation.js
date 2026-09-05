/**
 * Single source for the site menu: header, mobile menu and footer.
 * `labelKey` resolves through `t()` (see lib/i18n/translations.js under `nav`),
 * so header/footer stay in sync across languages.
 */
export const SITE_NAVIGATION = [
  { labelKey: 'home', to: '/' },
  {
    labelKey: 'about',
    to: '/gioi-thieu',
    children: [
      { labelKey: 'aboutOverview', to: '/gioi-thieu#tong-quan' },
      { labelKey: 'aboutMission', to: '/gioi-thieu#tam-nhin' },
      { labelKey: 'aboutLeadership', to: '/gioi-thieu#lanh-dao' },
      { labelKey: 'aboutStructure', to: '/gioi-thieu#co-cau' },
      { labelKey: 'aboutHistory', to: '/gioi-thieu#lich-su' },
    ],
  },
  { labelKey: 'fields', to: '/linh-vuc' },
  { labelKey: 'products', to: '/san-pham' },
  { labelKey: 'projects', to: '/du-an' },
  { labelKey: 'news', to: '/tin-tuc' },
  { labelKey: 'careers', to: '/tuyen-dung' },
  { labelKey: 'contact', to: '/lien-he' },
]

/** The two link columns in the footer. */
export const FOOTER_LINK_GROUPS = [
  {
    titleKey: 'aboutUsCol',
    links: [
      { labelKey: 'about', to: '/gioi-thieu' },
      { labelKey: 'fields', to: '/linh-vuc' },
      { labelKey: 'products', to: '/san-pham' },
      { labelKey: 'projectsFeatured', to: '/du-an' },
    ],
  },
  {
    titleKey: 'linksCol',
    links: [
      { labelKey: 'news', to: '/tin-tuc' },
      { labelKey: 'careers', to: '/tuyen-dung' },
      { labelKey: 'contact', to: '/lien-he' },
    ],
  },
]
