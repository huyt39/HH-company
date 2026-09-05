/**
 * Single source for the site menu: header, mobile menu and footer.
 * `labelKey` resolves through `t()` (see lib/i18n/translations.js under `nav`),
 * so header/footer stay in sync across languages.
 *
 * Ordered the way a main contractor reads the site: what we build, whether we
 * are able to, what we have already built — then the product catalogue. That
 * puts site work ahead of the catalogue, the way Freyssinet and VSL structure
 * the same trade.
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
  {
    labelKey: 'services',
    to: '/dich-vu',
    children: [
      { labelKey: 'servicesBuild', to: '/dich-vu#thi-cong-moi' },
      { labelKey: 'servicesRepair', to: '/dich-vu#sua-chua-tang-cuong' },
      { labelKey: 'servicesTechnology', to: '/dich-vu#cong-nghe-cung-cap' },
    ],
  },
  {
    labelKey: 'capability',
    to: '/nang-luc',
    children: [
      { labelKey: 'capabilityCertificates', to: '/nang-luc#chung-chi' },
      { labelKey: 'capabilityPersonnel', to: '/nang-luc#nhan-su' },
      { labelKey: 'capabilityEquipment', to: '/nang-luc#thiet-bi' },
      { labelKey: 'capabilityQuality', to: '/nang-luc#quy-trinh' },
      { labelKey: 'capabilityHse', to: '/nang-luc#an-toan' },
      { labelKey: 'capabilityDocuments', to: '/nang-luc#tai-lieu' },
    ],
  },
  { labelKey: 'projects', to: '/du-an' },
  { labelKey: 'products', to: '/san-pham' },
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
      { labelKey: 'services', to: '/dich-vu' },
      { labelKey: 'capability', to: '/nang-luc' },
      { labelKey: 'projectsFeatured', to: '/du-an' },
    ],
  },
  {
    titleKey: 'linksCol',
    links: [
      { labelKey: 'products', to: '/san-pham' },
      { labelKey: 'news', to: '/tin-tuc' },
      { labelKey: 'careers', to: '/tuyen-dung' },
      { labelKey: 'contact', to: '/lien-he' },
    ],
  },
]
