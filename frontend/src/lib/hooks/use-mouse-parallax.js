import { useEffect } from 'react'

// Furthest a photo with depth 1 travels from its place, in px.
const MAX_SHIFT = 32
// Extra turn a photo with depth 1 takes towards the pointer, in degrees.
const MAX_TURN = 2.5
// Share of the remaining distance covered each frame: the glide, not a snap.
const EASE = 0.08

/**
 * Photos already laid out inside `ref` drift the way the mouse moves: pointer
 * to the left of centre, they slide left; up, they rise. Each element marked
 * `data-depth` (0–1) moves by its own amount, so the front of the pile travels
 * further than the back and the block reads as layered. `data-tilt` is the
 * element's resting angle (degrees), kept while it moves; at rest the element's
 * own CSS should hold that angle, since the inline transform is dropped on unmount.
 *
 * Mouse only; touch screens and reduced motion leave the photos where they are.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 */
export function useMouseParallax(ref) {
  useEffect(() => {
    const zone = ref.current
    if (!zone) return undefined
    const canMove =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canMove) return undefined

    const layers = [...zone.querySelectorAll('[data-depth]')].map((el) => ({
      el,
      depth: Number(el.dataset.depth) || 0.5,
      tilt: Number(el.dataset.tilt) || 0,
      x: 0,
      y: 0,
      turn: 0,
    }))
    let target = { x: 0, y: 0 } // pointer position, -1..1 from the centre
    let frame = 0

    const paint = () => {
      let moving = false
      for (const layer of layers) {
        const goalX = target.x * layer.depth * MAX_SHIFT
        const goalY = target.y * layer.depth * MAX_SHIFT
        const goalTurn = target.x * layer.depth * MAX_TURN
        layer.x += (goalX - layer.x) * EASE
        layer.y += (goalY - layer.y) * EASE
        layer.turn += (goalTurn - layer.turn) * EASE
        if (Math.abs(goalX - layer.x) > 0.05 || Math.abs(goalY - layer.y) > 0.05) moving = true
        layer.el.style.transform =
          `translate3d(${layer.x.toFixed(2)}px, ${layer.y.toFixed(2)}px, 0) rotate(${(layer.tilt + layer.turn).toFixed(2)}deg)`
      }
      // Stop the loop once everything has settled; the next move restarts it.
      frame = moving ? requestAnimationFrame(paint) : 0
    }
    const wake = () => { if (!frame) frame = requestAnimationFrame(paint) }

    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return
      const box = zone.getBoundingClientRect()
      target = {
        x: ((event.clientX - box.left) / box.width) * 2 - 1,
        y: ((event.clientY - box.top) / box.height) * 2 - 1,
      }
      wake()
    }
    // Leaving the block, the photos drift back to where they were laid.
    const onLeave = () => {
      target = { x: 0, y: 0 }
      wake()
    }

    zone.addEventListener('pointermove', onMove)
    zone.addEventListener('pointerleave', onLeave)
    return () => {
      zone.removeEventListener('pointermove', onMove)
      zone.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
      layers.forEach(({ el }) => el.style.removeProperty('transform'))
    }
  }, [ref])
}
