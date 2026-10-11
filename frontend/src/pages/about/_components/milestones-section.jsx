import { useRef } from 'react'

import { SectionHeading } from '@/components/ui/section-heading'
import { useScrollProgress } from '@/lib/hooks/use-scroll-progress'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Milestones as a journey the reader travels down: the rail fills as the page
 * scrolls, each milestone lights up when the fill reaches its dot, and on wide
 * screens a large sticky year beside the list follows the one being read.
 */
export function MilestonesSection({ milestones }) {
  const { t } = useLang()
  const items = milestones ?? []
  const listRef = useRef(null)
  const active = useScrollProgress(listRef, '.timeline__item', 14, [items.length])

  const shown = items[Math.max(active, 0)]

  return (
    <section className="section" id="lich-su">
      <div className="container">
        <SectionHeading eyebrow={t('about.milestonesEyebrow')} title={t('about.milestonesTitle')} align="center" />
        <div className="journey">
          {shown && (
            <div className="journey__aside" aria-hidden="true">
              <div className="journey__sticky">
                {/* keyed so each new year plays its entrance again */}
                <span className="journey__year" key={shown.year}>
                  {shown.year}
                </span>
                <span className="journey__count">
                  {String(Math.max(active, 0) + 1).padStart(2, '0')}
                  <span> / {String(items.length).padStart(2, '0')}</span>
                </span>
                <span className="journey__bar">
                  <span style={{ transform: `scaleX(${(Math.max(active, 0) + 1) / items.length})` }} />
                </span>
              </div>
            </div>
          )}
          <ol className="timeline" ref={listRef} data-reveal-stagger>
            {items.map((item, index) => (
              <li
                className={`timeline__item${index <= active ? ' is-reached' : ''}${index === active ? ' is-current' : ''}`}
                key={item.year}
              >
                <span className="timeline__year">{item.year}</span>
                <div className="timeline__content">
                  <h3>{item.title}</h3>
                  <p className="text-muted mb-0">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
