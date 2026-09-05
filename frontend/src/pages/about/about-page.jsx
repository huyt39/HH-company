import { PageBanner } from '@/components/ui/page-banner'
import { companyApi } from '@/lib/api/company-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import { CompanyFacts } from './_components/company-facts'
import { LeadersSection } from './_components/leaders-section'
import { ManufacturersSection } from './_components/manufacturers-section'
import { MilestonesSection } from './_components/milestones-section'
import { OrgChartSection } from './_components/org-chart-section'
import { VisionSection } from './_components/vision-section'
import './about-page.css'

export function AboutPage() {
  const { t } = useLang()
  useDocumentMeta({ title: t('about.metaTitle'), description: t('about.metaDesc') })

  const { data: profile } = useFetch((options) => companyApi.getProfile(options), [])
  const { data: partners } = useFetch(
    (options) => companyApi.getPartners({ role: 'manufacturer' }, options),
    [],
  )

  return (
    <>
      <PageBanner
        title={t('nav.about')}
        subtitle={profile?.tagline}
      />

      <CompanyFacts profile={profile} />
      <VisionSection profile={profile} />
      <LeadersSection leaders={profile?.leaders} />
      <OrgChartSection orgUnits={profile?.org_units} />
      <MilestonesSection milestones={profile?.milestones} />
      <ManufacturersSection partners={partners} />
    </>
  )
}
