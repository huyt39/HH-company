import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Four commitments; static content, not from the API.
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
    <section className="section section--dark">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.strengthsEyebrow')}
          title={t('home.strengthsTitle')}
          align="center"
          light
        />
        <div className="grid grid--2">
          {strengths.map((item, index) => (
            <div className="commitment" key={item.title}>
              <span className="commitment__index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p className="mb-0">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
