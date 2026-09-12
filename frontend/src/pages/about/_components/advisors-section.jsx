import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Ban Cố vấn kiêm sáng lập — the technical bench, kept apart from the executive
 * leadership above it. What makes these people worth naming is the work behind
 * them, so each card leads with the highlights rather than a portrait.
 */
export function AdvisorsSection({ advisors }) {
  const { t } = useLang()

  if (!advisors?.length) return null

  return (
    <section className="section section--soft" id="ban-co-van">
      <div className="container">
        <SectionHeading
          eyebrow={t('about.advisorsEyebrow')}
          title={t('about.advisorsTitle')}
          description={t('about.advisorsDesc')}
          align="center"
        />
        <div className="advisor-grid">
          {advisors.map((advisor) => (
            <article className="advisor-card" key={advisor.name}>
              <h3>{advisor.name}</h3>
              <p className="advisor-card__title">{advisor.title}</p>
              {advisor.highlights?.length > 0 && (
                <ul className="advisor-card__list">
                  {advisor.highlights.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
