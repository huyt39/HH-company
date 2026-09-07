import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Overview: the intro text, then the registration details as a flat two-column
 * record below it.
 *
 * These are the fields a main contractor copies into a bid file, so they read
 * as a register extract — label, value, hairline rule — rather than a boxed
 * sidebar card. Running full width also halves the height: each fact takes one
 * row instead of stacking its label above its value.
 */
export function CompanyFacts({ profile }) {
  const { t } = useLang()
  const labels = t('about.factLabels')
  const facts = [
    { label: labels.fullName, value: profile?.name },
    { label: labels.nameEn, value: profile?.name_en },
    { label: labels.shortName, value: profile?.short_name },
    { label: labels.businessCode, value: profile?.tax_code },
    { label: labels.established, value: profile?.established },
    { label: labels.charterCapital, value: profile?.charter_capital },
    { label: labels.mainBusinessLine, value: profile?.main_business_line },
    {
      label: labels.businessLinesCount,
      value: profile?.business_lines_count
        ? t('about.businessLinesCountValue')(profile.business_lines_count)
        : null,
    },
    { label: labels.employeeScale, value: profile?.employees },
    { label: labels.status, value: profile?.status },
  ]

  return (
    <section className="section" id="tong-quan">
      <div className="container">
        <SectionHeading eyebrow={t('about.factsEyebrow')} title={t('about.factsTitle')} />
        <div className="about-intro">
          {profile?.intro?.map((paragraph, index) => (
            <p className="text-muted" key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="company-record">
          <h3 className="company-record__caption">{t('about.recordTitle')}</h3>
          <dl className="company-record__list">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value || t('common.updating')}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
