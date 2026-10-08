import { PartnerMarquee } from '@/components/ui/partner-marquee'
import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/** Manufacturers whose products the company imports and distributes. */
export function ManufacturersSection({ partners }) {
  const { t } = useLang()
  if (!partners?.length) return null

  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading
          eyebrow={t('about.manufacturersEyebrow')}
          title={t('about.manufacturersTitle')}
          align="center"
        />
      </div>
      <div data-reveal>
        <PartnerMarquee partners={partners} showCountry />
      </div>
    </section>
  )
}
