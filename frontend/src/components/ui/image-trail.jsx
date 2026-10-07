import { useEffect, useRef } from 'react'

import './image-trail.css'

// Pointer travel between two photos. Lower = a denser trail.
const SPAWN_DISTANCE = 80
// How long a photo stays before it starts to leave, and how many can be up at once.
const HOLD_MS = 650
const MAX_ON_SCREEN = 9
const IN_MS = 380
const OUT_MS = 650
const EASE_OUT = 'cubic-bezier(0.215, 0.61, 0.355, 1)'

const canTrail = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Photos drop wherever the mouse goes over `children`, pile up, and fade out
 * one after another — the cursor trail on nomu.store. Only with a real mouse:
 * touch screens and reduced motion get `children` as they are.
 *
 * @param {{images: string[], children: import('react').ReactNode, className?: string}} props
 */
export function ImageTrail({ images, children, className = '' }) {
  const zoneRef = useRef(null)

  useEffect(() => {
    const zone = zoneRef.current
    if (!zone || !images.length || !canTrail()) return undefined

    let next = 0
    let last = null
    let layer = 1
    const live = []

    // Fetch the photos once the visitor is near, so the first ones are not blank.
    const preload = () => images.forEach((src) => { new Image().src = src })

    const remove = (el) => {
      const index = live.indexOf(el)
      if (index >= 0) live.splice(index, 1)
      el.remove()
    }

    const leave = (el) => {
      if (el.dataset.leaving) return
      el.dataset.leaving = '1'
      el.animate(
        [{ opacity: 1, transform: el.style.transform }, { opacity: 0, transform: `${el.style.transform} translateY(24px) scale(0.86)` }],
        { duration: OUT_MS, easing: 'ease-in', fill: 'forwards' },
      ).finished.then(() => remove(el), () => remove(el))
    }

    const spawn = (x, y) => {
      const img = document.createElement('img')
      img.className = 'image-trail__photo'
      img.src = images[next]
      img.alt = ''
      img.decoding = 'async'
      next = (next + 1) % images.length

      const tilt = (Math.random() * 2 - 1) * 7
      img.style.left = `${x}px`
      img.style.top = `${y}px`
      img.style.zIndex = String(layer++)
      img.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`
      zone.appendChild(img)
      live.push(img)

      img.animate(
        [
          { opacity: 0, transform: `translate(-50%, -50%) rotate(${tilt * 1.6}deg) scale(0.55)` },
          { opacity: 1, transform: img.style.transform },
        ],
        { duration: IN_MS, easing: EASE_OUT },
      )
      setTimeout(() => leave(img), HOLD_MS + IN_MS)
      // Too many at once: the oldest goes early.
      if (live.length > MAX_ON_SCREEN) leave(live.find((el) => !el.dataset.leaving))
    }

    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return
      const box = zone.getBoundingClientRect()
      const x = event.clientX - box.left
      const y = event.clientY - box.top
      if (last && Math.hypot(x - last.x, y - last.y) < SPAWN_DISTANCE) return
      last = { x, y }
      spawn(x, y)
    }
    const onLeave = () => { last = null }

    zone.addEventListener('pointerenter', preload, { once: true })
    zone.addEventListener('pointermove', onMove)
    zone.addEventListener('pointerleave', onLeave)
    return () => {
      zone.removeEventListener('pointerenter', preload)
      zone.removeEventListener('pointermove', onMove)
      zone.removeEventListener('pointerleave', onLeave)
      live.splice(0).forEach((el) => el.remove())
    }
  }, [images])

  return (
    <div ref={zoneRef} className={`image-trail ${className}`.trim()}>
      {children}
    </div>
  )
}
