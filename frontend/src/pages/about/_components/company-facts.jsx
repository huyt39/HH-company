import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Overview: intro text with the company mark alongside, then the registration
 * details as a flat two-column record below.
 *
 * The facts are the fields a main contractor copies into a bid file, so they
 * read as a register extract — label, value, hairline rule — rather than a
 * boxed sidebar card. Running full width also halves the height: each fact
 * takes one row instead of stacking its label above its value.
 */
/**
 * Line drawing behind the logo: a box-girder deck carried on twin-column piers
 * over water — the span type the company works on, drawn the way it appears on
 * a general-arrangement sheet. Decorative only, so it is hidden from readers.
 */
function BridgeBackdrop() {
  const piers = [56, 170, 284]
  const railPosts = Array.from({ length: 18 }, (_, i) => 4 + i * 20)

  return (
    <svg className="overview__backdrop" viewBox="0 0 340 118" aria-hidden="true" focusable="false">
      <g className="overview__backdrop-water">
        <path d="M0 96q22-5 44 0t44 0 44 0 44 0 44 0 44 0 44 0" />
        <path d="M0 106q22-5 44 0t44 0 44 0 44 0 44 0 44 0 44 0" />
      </g>
      <g className="overview__backdrop-structure">
        {railPosts.map((x) => <path d={`M${x} 28V38`} key={x} />)}
        <path d="M0 28h340" />
        <path d="M0 38h340" />
        <path d="M0 52h340" />
        {piers.map((x) => (
          <g key={x}>
            <path d={`M${x - 17} 52h34v7h-34z`} />
            <path d={`M${x - 10} 59V92`} />
            <path d={`M${x + 10} 59V92`} />
            <path d={`M${x - 15} 92h30`} />
          </g>
        ))}
      </g>
    </svg>
  )
}

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
        <div className="overview">
          <div className="overview__text">
            <SectionHeading eyebrow={t('about.factsEyebrow')} title={t('about.factsTitle')} />
            {profile?.intro?.map((paragraph, index) => (
              <p className="text-muted" key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="overview__brand">
            <img
              className="overview__mark"
              src="/logo-full-alpha.png"
              alt={t('about.logoAlt')}
              width="493"
              height="620"
              loading="lazy"
              decoding="async"
            />
            <BridgeBackdrop />
          </div>
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
