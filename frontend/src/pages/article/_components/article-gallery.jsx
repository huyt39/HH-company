import { useRef, useState } from 'react'

import { useLang } from '@/lib/i18n/language-context'
import { fullUrl } from '@/lib/utils/media'

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
 * Single large photo viewer for an article: swipe or use the arrows to move
 * between the cover and gallery photos, click a photo to zoom to its actual
 * size and drag (or scroll) to pan around it.
 */
export function ArticleGallery({ cover, media }) {
  const { t } = useLang()
  const slides = buildSlides(cover, media)
  const [index, setIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const frameRef = useRef(null)
  const dragRef = useRef(null)

  if (!slides.length) return null

  const current = slides[index]
  const hasMultiple = slides.length > 1

  const goTo = (next) => {
    setIndex(((next % slides.length) + slides.length) % slides.length)
    setZoomed(false)
  }

  const handlePointerDown = (event) => {
    dragRef.current = {
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false,
    }
    if (event.pointerType === 'mouse') frameRef.current?.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) drag.moved = true

    if (zoomed && drag.pointerType === 'mouse') {
      const frame = frameRef.current
      if (frame) {
        frame.scrollLeft -= event.clientX - drag.lastX
        frame.scrollTop -= event.clientY - drag.lastY
      }
    }
    drag.lastX = event.clientX
    drag.lastY = event.clientY
  }

  const handlePointerUp = (event) => {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag) return
    if (event.pointerType === 'mouse') frameRef.current?.releasePointerCapture?.(event.pointerId)

    if (!zoomed && hasMultiple) {
      const dx = event.clientX - drag.startX
      const dy = event.clientY - drag.startY
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        goTo(index + (dx < 0 ? 1 : -1))
        return
      }
    }

    if (!drag.moved) {
      const frame = frameRef.current
      const rect = frame?.getBoundingClientRect()
      const fracX = rect ? (event.clientX - rect.left) / rect.width : 0.5
      const fracY = rect ? (event.clientY - rect.top) / rect.height : 0.5
      setZoomed((wasZoomed) => {
        const nowZoomed = !wasZoomed
        if (nowZoomed) {
          requestAnimationFrame(() => {
            if (!frame) return
            frame.scrollLeft = fracX * frame.scrollWidth - rect.width / 2
            frame.scrollTop = fracY * frame.scrollHeight - rect.height / 2
          })
        }
        return nowZoomed
      })
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' && hasMultiple) goTo(index - 1)
    else if (event.key === 'ArrowRight' && hasMultiple) goTo(index + 1)
    else if (event.key === 'Escape' && zoomed) setZoomed(false)
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setZoomed((z) => !z)
    }
  }

  return (
    <div className="gallery">
      <div
        className={`gallery__frame ${zoomed ? 'is-zoomed' : ''}`}
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
        <img
          src={fullUrl(current)}
          alt={current.alt || ''}
          decoding="async"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
        />
      </div>

      {hasMultiple && !zoomed && (
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

      {!zoomed && <span className="gallery__hint">{t('article.galleryZoomHint')}</span>}
    </div>
  )
}
