/**
 * Writes `public/sitemap.xml` from the static route list plus whatever the API
 * is serving for services, projects, news and jobs.
 *
 * The site URL is not hard-coded: pass it in, because committing a guessed
 * domain into the repo produces a sitemap that points at nothing.
 *
 *   SITE_URL=https://hoahoang.vn npm run sitemap
 *   SITE_URL=https://hoahoang.vn API_URL=https://hoahoang.vn/api/v1 npm run sitemap
 *
 * Without API_URL it still emits the static pages, which is the useful 80%.
 */
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const SITE_URL = (process.env.SITE_URL ?? '').replace(/\/$/, '')
const API_URL = (process.env.API_URL ?? '').replace(/\/$/, '')

if (!SITE_URL) {
  console.error('SITE_URL is required, e.g. SITE_URL=https://hoahoang.vn npm run sitemap')
  process.exit(1)
}

/** [path, changefreq, priority] */
const STATIC_ROUTES = [
  ['/', 'weekly', '1.0'],
  ['/gioi-thieu', 'monthly', '0.8'],
  ['/dich-vu', 'monthly', '0.9'],
  ['/nang-luc', 'monthly', '0.9'],
  ['/du-an', 'weekly', '0.9'],
  ['/san-pham', 'monthly', '0.7'],
  ['/tin-tuc', 'weekly', '0.6'],
  ['/tuyen-dung', 'weekly', '0.5'],
  ['/lien-he', 'yearly', '0.5'],
]

/** Unwrap the `{ success, detail, data }` envelope; returns [] on any failure. */
async function fetchList(endpoint) {
  if (!API_URL) return []
  try {
    const response = await fetch(`${API_URL}${endpoint}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const payload = await response.json()
    const data = payload?.data ?? payload
    return Array.isArray(data) ? data : (data?.items ?? [])
  } catch (error) {
    console.warn(`  skipped ${endpoint}: ${error.message}`)
    return []
  }
}

function urlEntry(loc, changefreq, priority, lastmod) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

const [services, projects, news, jobs] = await Promise.all([
  fetchList('/fields'),
  fetchList('/projects?page=1&page_size=200'),
  fetchList('/news?page=1&page_size=200'),
  fetchList('/careers?page=1&page_size=200'),
])

const entries = [
  ...STATIC_ROUTES.map(([loc, freq, priority]) => urlEntry(loc, freq, priority)),
  ...services.map((item) => urlEntry(`/dich-vu/${item.slug}`, 'monthly', '0.8')),
  ...projects.map((item) => urlEntry(`/du-an/${item.slug}`, 'monthly', '0.7', item.updated_at)),
  ...news.map((item) => urlEntry(`/tin-tuc/${item.slug}`, 'monthly', '0.5', item.updated_at)),
  ...jobs.map((item) => urlEntry(`/tuyen-dung/${item.slug}`, 'weekly', '0.4')),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

const target = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml')
await writeFile(target, xml, 'utf8')
console.log(`Wrote ${entries.length} URLs to ${target}`)
