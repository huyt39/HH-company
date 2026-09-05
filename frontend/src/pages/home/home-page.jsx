import { companyApi } from '@/lib/api/company-client'
import { fieldsApi } from '@/lib/api/fields-client'
import { newsApi } from '@/lib/api/news-client'
import { projectsApi } from '@/lib/api/projects-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import { AboutIntroSection } from './_components/about-intro-section'
import { FeaturedProjectsSection } from './_components/featured-projects-section'
import { HeroSection } from './_components/hero-section'
import { LatestNewsSection } from './_components/latest-news-section'
import { PartnersSection } from './_components/partners-section'
import { QuoteCtaSection } from './_components/quote-cta-section'
import { ServicesSection } from './_components/services-section'
import { StrengthsSection } from './_components/strengths-section'
import './home-page.css'

const FEATURED_PROJECTS = 6
const LATEST_NEWS = 3

/**
 * Fallbacks for the hero figures, used only until the profile loads. The real
 * numbers are edited in the admin under Hồ sơ công ty → Số liệu năng lực.
 */
const FALLBACK_STATS = [
  { value: '2013', labelKey: 'home.statEstablished' },
  { value: '30+', labelKey: 'home.statProjectsDone' },
]

export function HomePage() {
  useDocumentMeta()
  const { t, lang } = useLang()

  const services = useFetch((options) => fieldsApi.getFields(options), [])
  const projects = useFetch(
    (options) => projectsApi.getProjects({ page: 1, page_size: FEATURED_PROJECTS }, options),
    [],
  )
  const news = useFetch(
    (options) => newsApi.getArticles({ page: 1, page_size: LATEST_NEWS }, options),
    [],
  )
  const { data: partners } = useFetch(
    (options) => companyApi.getPartners({ role: 'customer' }, options),
    [],
  )
  const { data: profile } = useFetch((options) => companyApi.getProfile(options), [])

  // Contractor figures — how much work has been done, not what is on the shelf.
  const stats = profile?.capability_stats?.length
    ? profile.capability_stats.map((stat) => ({
        value: stat.value,
        label: lang === 'en' && stat.label_en ? stat.label_en : stat.label,
      }))
    : FALLBACK_STATS.map((stat) => ({ value: stat.value, label: t(stat.labelKey) }))

  return (
    <>
      <HeroSection stats={stats} />
      <AboutIntroSection />
      <ServicesSection
        services={services.data}
        loading={services.loading}
        error={services.error}
      />
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
