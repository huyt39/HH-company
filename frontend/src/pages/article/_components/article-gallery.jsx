import { useRef, useState } from 'react'

import { useLang } from '@/lib/i18n/language-context'
import { fullUrl } from '@/lib/utils/media'

import { ImageLightbox } from './image-lightbox'

const SWIPE_THRESHOLD = 50
const MOVE_THRESHOLD = 4

/** Cover first, then gallery photos, de-duplicated by URL. */
function buildSlides(cover, media) {
  const slides = []
  const seen = new Set()
  for (const item of [cover, ...(media ?? [])]) {
    if (!item?.url || seen.has(item.url)) continue
    seen.add(item.url)
    slides.push(item)
  }
  return slides
}

/**
 * Photo strip for an article: it slides between photos and follows the finger
 * while dragging. Clicking a photo hands it to the full-screen viewer, which is
 * where the real zooming happens.
 */
export function ArticleGallery({ cover, media }) {
  const { t } = useLang()
  const slides = buildSlides(cover, media)
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState(0)
  const [animating, setAnimating] = useState(true)
  const [lightbox, setLightbox] = useState(false)
  const frameRef = useRef(null)
  const dragRef = useRef(null)

  if (!slides.length) return null

  const hasMultiple = slides.length > 1

  const goTo = (next) => {
    setAnimating(true)
    setDrag(0)
    setIndex(((next % slides.length) + slides.length) % slides.length)
  }

  const handlePointerDown = (event) => {
    if (event.button != null && event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    }
    setAnimating(false)
    frameRef.current?.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const state = dragRef.current
    if (!state) return
    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY
    if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) state.moved = true
    if (!hasMultiple || !state.moved) return

    // Rubber-band at the two ends so the strip never drags into empty space.
    const atEdge = (dx > 0 && index === 0) || (dx < 0 && index === slides.length - 1)
    setDrag(atEdge ? dx * 0.35 : dx)
  }

  const handlePointerUp = (event) => {
    const state = dragRef.current
    dragRef.current = null
    if (!state) return
    frameRef.current?.releasePointerCapture?.(state.pointerId)
    setAnimating(true)
    setDrag(0)

    if (!state.moved) {
      setLightbox(true)
      return
    }

    if (!hasMultiple) return
    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY
    const next = index + (dx < 0 ? 1 : -1)
    // A swipe stops at the ends — only the arrows and dots wrap around.
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) && slides[next]) goTo(next)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' && hasMultiple) goTo(index - 1)
    else if (event.key === 'ArrowRight' && hasMultiple) goTo(index + 1)
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setLightbox(true)
    }
  }

  return (
    <div className="gallery">
      <div
        className={`gallery__frame ${animating ? '' : 'is-dragging'}`}
        ref={frameRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`gallery__track ${animating ? 'is-animating' : ''}`}
          style={{ transform: `translate3d(calc(${-index * 100}% + ${drag}px), 0, 0)` }}
        >
          {slides.map((slide, i) => (
            <div className="gallery__slide" key={slide.url} aria-hidden={i !== index}>
              <img
                src={fullUrl(slide)}
                alt={slide.alt || ''}
                loading={Math.abs(i - index) <= 1 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
        <span className="gallery__expand" aria-hidden="true">
          ⤢
        </span>
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            className="gallery__nav gallery__nav--prev"
            onClick={() => goTo(index - 1)}
            aria-label={t('article.galleryPrev')}
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery__nav gallery__nav--next"
            onClick={() => goTo(index + 1)}
            aria-label={t('article.galleryNext')}
          >
            ›
          </button>
          <div className="gallery__dots">
            {slides.map((slide, i) => (
              <button
                key={slide.url}
                type="button"
                className={`gallery__dot ${i === index ? 'is-active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={t('article.galleryCount')(i + 1, slides.length)}
              />
            ))}
          </div>
        </>
      )}

      <span className="gallery__hint">{t('article.galleryZoomHint')}</span>

      {lightbox && (
        <ImageLightbox
          slides={slides}
          startIndex={index}
          onClose={(lastIndex) => {
            setLightbox(false)
            // Come back to the photo the reader stopped on.
            if (typeof lastIndex === 'number') goTo(lastIndex)
            frameRef.current?.focus()
          }}
        />
      )}
    </div>
  )
}
