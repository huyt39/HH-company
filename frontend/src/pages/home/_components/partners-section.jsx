import { PartnerGrid } from '@/components/ui/partner-grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/** Past customers; hidden entirely when there is no data. */
export function PartnersSection({ partners }) {
  const { t } = useLang()
  if (!partners?.length) return null

  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading eyebrow={t('home.partnersEyebrow')} title={t('home.partnersTitle')} align="center" />
        <PartnerGrid partners={partners} />
      </div>
    </section>
  )
}
