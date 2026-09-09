import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { useLang } from '@/lib/i18n/language-context'

const AUTOPLAY_MS = 2000

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Featured projects on the home page, as one continuously looping row.
 *
 * A native scroll container with snap points rather than a carousel library, so
 * dragging, trackpad swipes and keyboard focus work on their own. The row
 * carries the projects twice: stepping past the last card lands on the copy of
 * the first, and the scroll position is then rewound by exactly one lap without
 * animation. The picture never runs backwards to start over.
 *
 * It stops on hover, on focus, while the tab is hidden, and for anyone who has
 * asked for reduced motion.
 */
export function FeaturedProjectsSection({ projects, loading, error }) {
  const { t } = useLang()
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = projects?.length ?? 0

  /** Card width plus gap — the distance of exactly one step. */
  const metrics = useCallback(() => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!track || !card || !count) return null
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const step = card.offsetWidth + gap
    return { track, step, lap: step * count }
  }, [count])

  /** Move by whole cards, rewinding a lap first so the row never runs out. */
  const advance = useCallback(
    (direction) => {
      const m = metrics()
      if (!m) return
      const { track, step, lap } = m
      let left = track.scrollLeft

      if (left >= lap - 1) {
        left -= lap
        track.scrollTo({ left, behavior: 'auto' })
      } else if (direction < 0 && left < step / 2) {
        left += lap
        track.scrollTo({ left, behavior: 'auto' })
      }

      track.scrollTo({
        left: left + direction * step,
        behavior: reducedMotion() ? 'auto' : 'smooth',
      })
    },
    [metrics],
  )

  const goToCard = useCallback(
    (target) => {
      const m = metrics()
      if (!m) return
      m.track.scrollTo({ left: target * m.step, behavior: reducedMotion() ? 'auto' : 'smooth' })
    },
    [metrics],
  )

  // Which card leads the row, read from the scroll position so dragging and
  // autoplay always agree.
  const handleScroll = useCallback(() => {
    const m = metrics()
    if (!m) return
    setIndex(Math.round(m.track.scrollLeft / m.step) % count)
  }, [metrics, count])

  useEffect(() => {
    if (paused || count < 2 || reducedMotion()) return undefined
    const timer = setInterval(() => advance(1), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused, count, advance])

  // A hidden tab should not advance through the row unseen.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const items = projects ?? []

  return (
    <section className="section">
      <div className="container">
        <div className="section-head-row">
          <SectionHeading eyebrow={t('home.featuredProjectsEyebrow')} title={t('home.featuredProjectsTitle')} />
          <Link to="/du-an" className="btn btn--outline">{t('home.featuredProjectsViewAll')}</Link>
        </div>
        <StateBlock
          loading={loading}
          error={error}
          isEmpty={!count}
          emptyTitle={t('home.featuredProjectsEmpty')}
        >
          <div
            className="project-rail"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <div
              className="project-rail__track"
              ref={trackRef}
              onScroll={handleScroll}
              onPointerDown={() => setPaused(true)}
            >
              {/* StateBlock decides what to show, but these children are built
                  first — so this must survive `projects` being undefined while
                  the request is still in flight. */}
              {items.map((project) => (
                <Card
                  key={project.id}
                  to={`/du-an/${project.slug}`}
                  media={project.cover}
                  tag={String(project.year)}
                  title={project.name}
                  meta={project.location}
                  excerpt={project.summary}
                />
              ))}
              {/* The second lap, which makes the wrap invisible. */}
              {items.map((project) => (
                <Card
                  key={`${project.id}-loop`}
                  duplicate
                  to={`/du-an/${project.slug}`}
                  media={project.cover}
                  tag={String(project.year)}
                  title={project.name}
                  meta={project.location}
                  excerpt={project.summary}
                />
              ))}
            </div>

            {count > 1 && (
              <div className="project-rail__controls">
                <div className="project-rail__dots">
                  {items.map((project, i) => (
                    <button
                      type="button"
                      key={project.id}
                      className={`project-rail__dot${i === index ? ' is-active' : ''}`}
                      aria-label={t('home.featuredProjectsGoTo')(i + 1)}
                      aria-current={i === index}
                      onClick={() => goToCard(i)}
                    />
                  ))}
                </div>
                <div className="project-rail__arrows">
                  <button
                    type="button"
                    className="project-rail__arrow"
                    aria-label={t('home.featuredProjectsPrev')}
                    onClick={() => advance(-1)}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="project-rail__arrow"
                    aria-label={t('home.featuredProjectsNext')}
                    onClick={() => advance(1)}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </StateBlock>
      </div>
    </section>
  )
}
