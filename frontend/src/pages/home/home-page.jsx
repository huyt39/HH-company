import { companyApi } from '@/lib/api/company-client'
import { fieldsApi } from '@/lib/api/fields-client'
import { newsApi } from '@/lib/api/news-client'
import { projectsApi } from '@/lib/api/projects-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { formatBillion } from '@/lib/utils/number-format'

import { AboutIntroSection } from './_components/about-intro-section'
import { FeaturedProjectsSection } from './_components/featured-projects-section'
import { FieldsSection } from './_components/fields-section'
import { HeroSection } from './_components/hero-section'
import { LatestNewsSection } from './_components/latest-news-section'
import { PartnersSection } from './_components/partners-section'
import { QuoteCtaSection } from './_components/quote-cta-section'
import { StrengthsSection } from './_components/strengths-section'
import './home-page.css'

const FEATURED_PROJECTS = 6
const LATEST_NEWS = 3

export function HomePage() {
  useDocumentMeta()

  const fields = useFetch((options) => fieldsApi.getFields(options), [])
  const projects = useFetch(
    (options) => projectsApi.getProjects({ page: 1, page_size: FEATURED_PROJECTS }, options),
    [],
  )
  const news = useFetch(
    (options) => newsApi.getArticles({ page: 1, page_size: LATEST_NEWS }, options),
    [],
  )
  const { data: financials } = useFetch((options) => companyApi.getFinancials(options), [])
  const { data: partners } = useFetch(
    (options) => companyApi.getPartners({ role: 'customer' }, options),
    [],
  )
  const { data: profile } = useFetch((options) => companyApi.getProfile(options), [])

  const latestYear = financials?.[financials.length - 1]
  const stats = [
    { value: '2013', label: 'Năm thành lập' },
    { value: `${projects.data?.total ?? '30'}+`, label: 'Dự án đã thực hiện' },
    {
      value: latestYear ? formatBillion(latestYear.revenue) : '—',
      label: `Doanh thu ${latestYear?.year ?? ''} (tỷ đồng)`,
    },
    { value: profile?.employees?.replace(' nhân sự', '') ?? '25 – 99', label: 'Cán bộ nhân viên' },
  ]

  return (
    <>
      <HeroSection stats={stats} />
      <AboutIntroSection />
      <FieldsSection fields={fields.data} loading={fields.loading} error={fields.error} />
      <StrengthsSection />
      <FeaturedProjectsSection
        projects={projects.data?.items}
        loading={projects.loading}
        error={projects.error}
      />
      <PartnersSection partners={partners} />
      <LatestNewsSection articles={news.data?.items} loading={news.loading} error={news.error} />
      <QuoteCtaSection />
    </>
  )
}
