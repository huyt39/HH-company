import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/** First letter of the given name, used as a text avatar. */
const initialOf = (fullName) => fullName.trim().split(' ').pop().charAt(0)

export function LeadersSection({ leaders }) {
  const { t } = useLang()

  return (
    <section className="section" id="lanh-dao">
      <div className="container">
        <SectionHeading eyebrow={t('about.leadersEyebrow')} title={t('about.leadersTitle')} align="center" />
        <div className="grid grid--2 leader-grid">
          {leaders?.map((leader) => (
            <div className="leader-card" key={leader.name}>
              <div className="leader-card__avatar" aria-hidden="true">{initialOf(leader.name)}</div>
              <div>
                <h3 className="mb-0">{leader.name}</h3>
                <p className="text-muted mb-0">{leader.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
