import { DomainIcon } from '@/components/ui/domain-icon'
import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Four commitments; static content, not from the API.
 *
 * On the lighter of the two dark grounds: the featured projects follow
 * immediately on the darker one, and a single shade would have run the two
 * sections together into one unbroken band.
 *
 * These answer what a main contractor asks of a specialist subcontractor —
 * crew, plant, safety, handover paperwork. The material-origin and test
 * certificates that used to sit here belong to the supply side and now live on
 * the products page.
 */
// Keyed by position: `home.strengths` is a fixed list of four in every
// language, and the icon belongs to the promise, not to the translated string.
const STRENGTH_ICONS = ['doi-thi-cong', 'thiet-bi-so-huu', 'an-toan-hse', 'ho-so-nghiem-thu']

export function StrengthsSection() {
  const { t } = useLang()
  const strengths = t('home.strengths')

  return (
    <section className="section section--dark section--dark-soft">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.strengthsEyebrow')}
          title={t('home.strengthsTitle')}
          align="center"
          light
        />
        {/* Headlines only, four across. The explanatory sentence under each
            one said what the rest of the site already proves — the equipment
            schedule, the HSE section, the handover documents — and turned a
            glanceable row into four paragraphs. */}
        <div className="commitments commitments--headline">
          {strengths.map((item, index) => (
            <div className="commitment" key={item.title}>
              <span className="commitment__mark" aria-hidden="true">
                <DomainIcon slug={STRENGTH_ICONS[index]} kind="commitment" />
              </span>
              <div className="commitment__body">
                <h3 className="mb-0">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
