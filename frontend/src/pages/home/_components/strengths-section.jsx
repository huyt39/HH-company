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
        <div className="commitments">
          {strengths.map((item, index) => (
            <div className="commitment" key={item.title}>
              <span className="commitment__index">{String(index + 1).padStart(2, '0')}</span>
              <div className="commitment__body">
                <h3>{item.title}</h3>
                <p className="mb-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
