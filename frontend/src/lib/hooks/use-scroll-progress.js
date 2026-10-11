import { useEffect, useState } from 'react'

// The line on screen that counts as "now": an item whose marker has scrolled
// above it is reached, and the rail is filled down to it.
const READ_LINE = 0.55

/**
 * Scroll progress through a vertical list drawn on a rail (the about-page
 * milestones, the capability quality steps). Writes how far the rail is filled
 * to `--rail-fill` on the list, and returns the index of the last item reached
 * (-1 before the first).
 *
 * @param {import('react').RefObject<HTMLElement>} listRef
 * @param {string} itemSelector the list's items, e.g. '.timeline__item'
 * @param {number} markerOffset px from an item's top edge to its marker
 * @param {unknown[]} deps re-measure when these change (the item count)
 */
export function useScrollProgress(listRef, itemSelector, markerOffset, deps) {
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * READ_LINE
      const box = list.getBoundingClientRect()
      list.style.setProperty('--rail-fill', `${Math.min(Math.max(line - box.top, 0), box.height)}px`)

      let reached = -1
      list.querySelectorAll(itemSelector).forEach((item, index) => {
        if (item.getBoundingClientRect().top + markerOffset <= line) reached = index
      })
      setActive(reached)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, deps)

  return active
}
