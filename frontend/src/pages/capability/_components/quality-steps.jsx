import { useRef } from 'react'

import { useScrollProgress } from '@/lib/hooks/use-scroll-progress'

const pad = (n) => String(n).padStart(2, '0')

/**
 * The construction-and-acceptance sequence as a track the reader moves along,
 * the same way the about page's milestones read: the rail fills as the page
 * scrolls, each numbered stop lights up when reached, and on wide screens a
 * large sticky step number beside the list follows the step being read.
 *
 * @param {{steps: {title: string, text: string}[], label: string}} props `label` precedes the big number ("Bước")
 */
export function QualitySteps({ steps, label }) {
  const listRef = useRef(null)
  // the numbered marker's centre sits ~20px below the step's top edge
  const active = useScrollProgress(listRef, '.process__step', 20, [steps.length])
  const current = Math.max(active, 0)

  return (
    <div className="process">
      <div className="process__aside" aria-hidden="true">
        <div className="process__sticky">
          <span className="process__label">{label}</span>
          {/* keyed so each new number plays its entrance again */}
          <span className="process__number" key={current}>
            {pad(current + 1)}
          </span>
          <span className="process__title">{steps[current]?.title}</span>
          <span className="process__bar">
            <span style={{ transform: `scaleX(${(current + 1) / steps.length})` }} />
          </span>
        </div>
      </div>
      <ol className="process__list" ref={listRef} data-reveal-stagger>
        {steps.map((step, index) => (
          <li
            className={`process__step${index <= active ? ' is-reached' : ''}${index === active ? ' is-current' : ''}`}
            key={step.title}
          >
            <span className="process__marker">{pad(index + 1)}</span>
            <div className="process__body">
              <h3>{step.title}</h3>
              <p className="text-muted mb-0">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
