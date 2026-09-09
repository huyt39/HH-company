import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { useLang } from '@/lib/i18n/language-context'

const AUTOPLAY_MS = 5000

/**
 * Featured projects on the home page, as one self-advancing row.
 *
 * A native scroll container with snap points rather than a carousel library:
 * dragging, trackpad swipes and keyboard focus already work, and the autoplay
 * is a scroll call on a timer. It stops on hover, on focus, while the tab is
 * hidden, once the visitor scrolls the row themselves, and for anyone who asks
 * for reduced motion.
 */
export function FeaturedProjectsSection({ projects, loading, error }) {
  const { t } = useLang()
  const trackRef = useRef(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)
  const [paused, setPaused] = useState(false)
  const count = projects?.length ?? 0

  /** Card width plus gap, and how many fit — both change with the breakpoint. */
  const metrics = useCallback(() => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!track || !card) return null
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const step = card.offsetWidth + gap
    const perView = Math.max(1, Math.round((track.clientWidth + gap) / step))
    return { track, step, perView }
  }, [])

  const goTo = useCallback(
    (index, behavior = 'smooth') => {
      const m = metrics()
      if (!m) return
      m.track.scrollTo({ left: index * m.perView * m.step, behavior })
    },
    [metrics],
  )

  // Page count, recalculated when the row is resized.
  useEffect(() => {
    const track = trackRef.current
    if (!track || !count) return undefined

    const measure = () => {
      const m = metrics()
      if (m) setPages(Math.max(1, Math.ceil(count / m.perView)))
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [count, metrics])

  // Which page is on screen, driven by the scroll position itself so dragging
  // and autoplay stay in agreement.
  const handleScroll = useCallback(() => {
    const m = metrics()
    if (!m) return
    setPage(Math.round(m.track.scrollLeft / (m.perView * m.step)))
  }, [metrics])

  useEffect(() => {
    if (paused || pages < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = setInterval(() => {
      setPage((current) => {
        const next = (current + 1) % pages
        goTo(next)
        return next
      })
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused, pages, goTo])

  // A hidden tab should not advance through the row unseen.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const step = (direction) => {
    const next = Math.min(pages - 1, Math.max(0, page + direction))
    setPage(next)
    goTo(next)
  }

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
              {projects.map((project) => (
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
            </div>

            {pages > 1 && (
              <div className="project-rail__controls">
                <div className="project-rail__dots">
                  {Array.from({ length: pages }, (_, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`project-rail__dot${index === page ? ' is-active' : ''}`}
                      aria-label={t('home.featuredProjectsGoTo')(index + 1)}
                      aria-current={index === page}
                      onClick={() => {
                        setPage(index)
                        goTo(index)
                      }}
                    />
                  ))}
                </div>
                <div className="project-rail__arrows">
                  <button
                    type="button"
                    className="project-rail__arrow"
                    aria-label={t('home.featuredProjectsPrev')}
                    disabled={page === 0}
                    onClick={() => step(-1)}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="project-rail__arrow"
                    aria-label={t('home.featuredProjectsNext')}
                    disabled={page >= pages - 1}
                    onClick={() => step(1)}
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
