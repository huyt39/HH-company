import { PersonAvatar } from '@/components/ui/person-avatar'
import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Ban Cố vấn kiêm sáng lập — the technical bench, kept apart from the executive
 * leadership above it.
 *
 * The chair leads on a card of his own across the row, the members follow
 * beneath him. Three equal columns could not work: his record is a list of
 * named bridges and theirs is two lines, so the row sized itself to him and
 * left the other two cards standing in a void. The split is also the truth of
 * the board — he founded it.
 *
 * Inside the card the record is a ticked list. Hairline rules between the
 * lines chopped each person into table rows, which is what made the section
 * read as a spec sheet rather than a bench of engineers.
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
          {/* Position, not a flag on the record: the chair heads the list in the
              company profile and in the org chart, so he heads it here too. */}
          {advisors.map((advisor, index) => (
            <article
              className={`advisor-card ${index === 0 ? 'advisor-card--lead' : ''}`.trim()}
              key={advisor.name}
            >
              <header className="advisor-card__head">
                <PersonAvatar name={advisor.name} photo={advisor.photo} />
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
