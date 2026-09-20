import { PersonAvatar } from '@/components/ui/person-avatar'
import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * The board and the deputy general managers, as portrait cards.
 *
 * Laid out around a photograph rather than beside a name: these were rows with
 * a 48px disc, which is a size a face cannot be read at, and dropping the real
 * portraits in later would have meant rebuilding the section anyway.
 */
export function LeadersSection({ leaders }) {
  const { t } = useLang()

  return (
    <section className="section" id="lanh-dao">
      <div className="container">
        <SectionHeading eyebrow={t('about.leadersEyebrow')} title={t('about.leadersTitle')} align="center" />
        <div className="leader-grid">
          {leaders?.map((leader) => (
            <div className="leader-card" key={leader.name}>
              <PersonAvatar name={leader.name} photo={leader.photo} />
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
