import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'
import { initialOf } from '@/lib/utils/initials'

/**
 * Ban Cố vấn kiêm sáng lập — the technical bench, kept apart from the executive
 * leadership above it.
 *
 * Built as the leadership card above plus a record of the work: same initial
 * disc, same name-over-role header, then the bridges behind the name as
 * hairline-separated rows. Bulleted paragraphs under a green-capped job title
 * made three cards of very different length look like three different things.
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
              <header className="advisor-card__head">
                <span className="advisor-card__avatar" aria-hidden="true">
                  {initialOf(advisor.name)}
                </span>
                <div>
                  <h3 className="mb-0">{advisor.name}</h3>
                  <p className="advisor-card__title mb-0">{advisor.title}</p>
                </div>
              </header>
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
