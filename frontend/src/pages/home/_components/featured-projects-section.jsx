import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { useLang } from '@/lib/i18n/language-context'
import { fullUrl } from '@/lib/utils/media'

const AUTOPLAY_MS = 2000

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Featured projects on the home page: the most recent job at full width, then
 * the rest as one continuously looping row beneath it.
 *
 * The whole block sits on the dark ground so the site photography carries it —
 * on white these bridges washed out.
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
  // The rail carries everything except the feature, and the loop maths is all
  // measured against that shorter list.
  const railCount = Math.max(0, count - 1)

  /** Card width plus gap — the distance of exactly one step. */
  const metrics = useCallback(() => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!track || !card || !railCount) return null
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const step = card.offsetWidth + gap
    return { track, step, lap: step * railCount }
  }, [railCount])

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
    setIndex(Math.round(m.track.scrollLeft / m.step) % railCount)
  }, [metrics, railCount])

  useEffect(() => {
    if (paused || railCount < 2 || reducedMotion()) return undefined
    const timer = setInterval(() => advance(1), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused, railCount, advance])

  // A hidden tab should not advance through the row unseen.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const items = projects ?? []
  const [feature, ...rest] = items

  return (
    <section className="section section--dark">
      <div className="container">
        <div className="section-head-row">
          <SectionHeading
            eyebrow={t('home.featuredProjectsEyebrow')}
            title={t('home.featuredProjectsTitle')}
            light
          />
          <Link to="/du-an" className="btn btn--ghost-light">{t('home.featuredProjectsViewAll')}</Link>
        </div>
        <StateBlock
          loading={loading}
          error={error}
          isEmpty={!count}
          emptyTitle={t('home.featuredProjectsEmpty')}
        >
          {feature && (
            <Link className="project-feature" to={`/du-an/${feature.slug}`}>
              <div className="project-feature__media">
                {fullUrl(feature.cover) && (
                  <img
                    src={fullUrl(feature.cover)}
                    alt={feature.cover?.alt || ''}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                {feature.year && <span className="card__tag">{feature.year}</span>}
              </div>
              <div className="project-feature__body">
                <span className="project-feature__meta">
                  {[feature.structure_type, feature.location].filter(Boolean).join(' · ')}
                </span>
                <h3 className="project-feature__title">{feature.name}</h3>
                {feature.summary && <p className="project-feature__excerpt">{feature.summary}</p>}
              </div>
            </Link>
          )}

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
              {rest.map((project) => (
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
              {rest.map((project) => (
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

            {rest.length > 1 && (
              <div className="project-rail__controls">
                <div className="project-rail__dots">
                  {rest.map((project, i) => (
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
