import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useLang } from '@/lib/i18n/language-context'
import { fullUrl } from '@/lib/utils/media'

const SWIPE_THRESHOLD = 60
const DISMISS_THRESHOLD = 110
const MOVE_THRESHOLD = 4
const MAX_ZOOM = 5
const CLICK_ZOOM = 2.5

const FIT = { scale: 1, x: 0, y: 0 }

const clamp = (value, limit) => Math.min(limit, Math.max(-limit, value))

/**
 * The photo fills its box with `object-fit: contain`, so its painted size is
 * smaller than the element — pan limits have to use the painted size or the
 * drag would run off into the letterbox.
 */
function paintedSize(img) {
  const box = { w: img.offsetWidth, h: img.offsetHeight }
  if (!img.naturalWidth || !img.naturalHeight) return box
  const fit = Math.min(box.w / img.naturalWidth, box.h / img.naturalHeight)
  return { w: img.naturalWidth * fit, h: img.naturalHeight * fit }
}

/** How far a photo at this scale may travel before its edge enters the frame. */
function panLimits(img, scale) {
  if (!img) return { x: 0, y: 0 }
  const painted = paintedSize(img)
  return {
    x: Math.max(0, (painted.w * scale - img.offsetWidth) / 2),
    y: Math.max(0, (painted.h * scale - img.offsetHeight) / 2),
  }
}

/**
 * Full-screen photo viewer. The photo fills the window — that is the "zoom in"
 * a reader expects — and from there swipe, the arrows or ←/→ move between
 * photos. Clicking (or the wheel) magnifies further, and dragging then pans.
 */
export function ImageLightbox({ slides, startIndex = 0, onClose }) {
  const { t } = useLang()
  const [index, setIndex] = useState(startIndex)
  const [zoom, setZoom] = useState(FIT)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [animating, setAnimating] = useState(true)
  const [closing, setClosing] = useState(false)
  const surfaceRef = useRef(null)
  const imgRef = useRef(null)
  const dragRef = useRef(null)

  const zoomed = zoom.scale > 1
  const current = slides[index]

  const goTo = useCallback(
    (next) => {
      if (next < 0 || next >= slides.length) return
      setAnimating(true)
      setDrag({ x: 0, y: 0 })
      setIndex(next)
      setZoom(FIT)
    },
    [slides.length],
  )

  // `zoomTo` reads the live scale without re-subscribing the wheel listener.
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom

  /** Magnify around a point so whatever sits under the cursor stays there. */
  const zoomTo = useCallback((scale, clientX, clientY) => {
    const img = imgRef.current
    if (!img) return
    const next = Math.min(MAX_ZOOM, Math.max(1, scale))
    if (next === 1) {
      setZoom(FIT)
      return
    }
    // Scaling happens about the element centre, which the current translate has
    // already moved — so measure the cursor against the *transformed* box and
    // the correction is simply `offset * (1 - ratio)` on top of that translate.
    const rect = img.getBoundingClientRect()
    const offsetX = clientX - (rect.left + rect.width / 2)
    const offsetY = clientY - (rect.top + rect.height / 2)
    const ratio = next / zoomRef.current.scale
    const limit = panLimits(img, next)
    setZoom((z) => ({
      scale: next,
      x: clamp(z.x + offsetX * (1 - ratio), limit.x),
      y: clamp(z.y + offsetY * (1 - ratio), limit.y),
    }))
  }, [])

  // Lock the page behind the overlay, and give it the keyboard.
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    surfaceRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  // Wheel zoom needs a non-passive listener to keep the page from scrolling.
  useEffect(() => {
    const surface = surfaceRef.current
    if (!surface) return undefined
    const onWheel = (event) => {
      event.preventDefault()
      const factor = Math.exp(-event.deltaY / 320)
      zoomTo(zoomRef.current.scale * factor, event.clientX, event.clientY)
    }
    surface.addEventListener('wheel', onWheel, { passive: false })
    return () => surface.removeEventListener('wheel', onWheel)
  }, [zoomTo])

  const requestClose = useCallback(() => {
    setClosing(true)
    window.setTimeout(() => onClose(index), 180)
  }, [onClose, index])

  const handlePointerDown = (event) => {
    if (event.button != null && event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      onImage: event.target === imgRef.current,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false,
    }
    setAnimating(false)
    surfaceRef.current?.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const state = dragRef.current
    if (!state) return
    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY
    if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) state.moved = true

    if (zoomed) {
      const limit = panLimits(imgRef.current, zoom.scale)
      const stepX = event.clientX - state.lastX
      const stepY = event.clientY - state.lastY
      setZoom((z) => ({ ...z, x: clamp(z.x + stepX, limit.x), y: clamp(z.y + stepY, limit.y) }))
    } else if (state.moved) {
      // Horizontal drag pages between photos; a vertical one dismisses.
      const horizontal = Math.abs(dx) > Math.abs(dy)
      const atEdge = (dx > 0 && index === 0) || (dx < 0 && index === slides.length - 1)
      setDrag(horizontal ? { x: atEdge ? dx * 0.35 : dx, y: 0 } : { x: 0, y: dy })
    }

    state.lastX = event.clientX
    state.lastY = event.clientY
  }

  const handlePointerUp = (event) => {
    const state = dragRef.current
    dragRef.current = null
    if (!state) return
    surfaceRef.current?.releasePointerCapture?.(state.pointerId)
    setAnimating(true)

    if (!state.moved) {
      setDrag({ x: 0, y: 0 })
      if (!state.onImage) requestClose()
      else if (zoomed) setZoom(FIT)
      else zoomTo(CLICK_ZOOM, event.clientX, event.clientY)
      return
    }

    if (!zoomed) {
      const dx = event.clientX - state.startX
      const dy = event.clientY - state.startY
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          goTo(index + (dx < 0 ? 1 : -1))
          return
        }
      } else if (Math.abs(dy) > DISMISS_THRESHOLD) {
        requestClose()
        return
      }
    }
    setDrag({ x: 0, y: 0 })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (zoomed) setZoom(FIT)
      else requestClose()
    } else if (event.key === 'ArrowLeft') goTo(index - 1)
    else if (event.key === 'ArrowRight') goTo(index + 1)
    else if (event.key === '+' || event.key === '=') {
      const rect = surfaceRef.current.getBoundingClientRect()
      zoomTo(zoom.scale * 1.5, rect.left + rect.width / 2, rect.top + rect.height / 2)
    } else if (event.key === '-') {
      const rect = surfaceRef.current.getBoundingClientRect()
      zoomTo(zoom.scale / 1.5, rect.left + rect.width / 2, rect.top + rect.height / 2)
    }
  }

  const hasMultiple = slides.length > 1
  const dismissProgress = Math.min(1, Math.abs(drag.y) / (DISMISS_THRESHOLD * 2.4))

  return createPortal(
    <div
      className={`lightbox ${closing ? 'is-closing' : ''} ${zoomed ? 'is-zoomed' : ''} ${animating ? '' : 'is-dragging'}`}
      style={{ '--lightbox-fade': 1 - dismissProgress }}
      role="dialog"
      aria-modal="true"
      aria-label={t('article.galleryCount')(index + 1, slides.length)}
    >
      <div
        className="lightbox__surface"
        ref={surfaceRef}
        tabIndex={-1}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`lightbox__track ${animating ? 'is-animating' : ''}`}
          style={{
            transform: `translate3d(calc(${-index * 100}% + ${drag.x}px), ${drag.y}px, 0)`,
          }}
        >
          {slides.map((slide, i) => {
            const isCurrent = i === index
            return (
              <div className="lightbox__slide" key={slide.url} aria-hidden={!isCurrent}>
                <img
                  ref={isCurrent ? imgRef : undefined}
                  src={fullUrl(slide)}
                  alt={slide.alt || ''}
                  loading={Math.abs(i - index) <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  style={
                    isCurrent && zoomed
                      ? { transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})` }
                      : undefined
                  }
                />
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        className="lightbox__close"
        onClick={requestClose}
        aria-label={t('article.galleryClose')}
      >
        ✕
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label={t('article.galleryPrev')}
          >
            ‹
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={() => goTo(index + 1)}
            disabled={index === slides.length - 1}
            aria-label={t('article.galleryNext')}
          >
            ›
          </button>
        </>
      )}

      <div className="lightbox__bar">
        {hasMultiple && (
          <span className="lightbox__count">{t('article.galleryCount')(index + 1, slides.length)}</span>
        )}
        {current.alt && <span className="lightbox__caption">{current.alt}</span>}
        <span className="lightbox__hint">{t('article.galleryLightboxHint')}</span>
      </div>
    </div>,
    document.body,
  )
}
