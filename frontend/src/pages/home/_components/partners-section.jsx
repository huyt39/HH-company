import { PartnerMarquee } from '@/components/ui/partner-marquee'
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
      </div>
      {/* Edge to edge, like a ticker: the strip runs past the content width. */}
      <div data-reveal>
        <PartnerMarquee partners={partners} />
      </div>
    </section>
  )
}
