import { useLayoutEffect } from 'react'

// Timings; must match the custom properties on `.js-reveal` in global.css.
const STAGGER_MS = 90 // between items of one `data-reveal-stagger` group
const BLOCK_MS = 750 // one block's fade-up
const CHAR_STEP_MS = 18 // between letters of a `data-reveal-text` heading
const CHAR_MS = 600 // one letter's rise

/**
 * Reveal content as it scrolls into view, the way the reference site does:
 * blocks fade up a little; headings rise in letter by letter.
 *
 * Inside `ref`:
 * - `data-reveal` — the element fades up on its own;
 * - `data-reveal-stagger` — its direct children fade up one after another;
 * - `data-reveal-text` — a heading whose letters are `SplitText` spans.
 * Content that arrives later (cards after a fetch) is picked up too.
 *
 * Only the container with `js-reveal` hides anything, and that class is added
 * here — so without JS, or with reduced motion, the page simply shows as is.
 * Once an element has played, its attributes are removed so its own transforms
 * and transitions (card hover lifts, carousels) work normally.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 */
export function useScrollReveal(ref) {
  // Layout effect: hide before the first paint, or the hero shows, vanishes
  // and comes back instead of animating in.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timers = new Set()

    const playTime = (el) => {
      const delay = parseInt(el.style.getPropertyValue('--reveal-delay'), 10) || 0
      if (!el.hasAttribute('data-reveal-text')) return delay + BLOCK_MS
      const letters = el.querySelectorAll('.split-char').length
      return delay + letters * CHAR_STEP_MS + CHAR_MS
    }

    const finish = (el) => {
      el.removeAttribute('data-reveal')
      el.removeAttribute('data-reveal-text')
      el.removeAttribute('data-revealed')
      el.style.removeProperty('--reveal-delay')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          observer.unobserve(el)
          el.setAttribute('data-revealed', '')
          const timer = setTimeout(() => {
            timers.delete(timer)
            finish(el)
          }, playTime(el) + 100)
          timers.add(timer)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    const seen = new WeakSet()
    const scan = () => {
      root.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
        ;[...group.children].forEach((child, index) => {
          if (seen.has(child)) return
          // A split heading keeps its letter animation; it only takes the delay.
          if (!child.hasAttribute('data-reveal-text')) child.setAttribute('data-reveal', '')
          child.style.setProperty('--reveal-delay', `${index * STAGGER_MS}ms`)
        })
      })
      root.querySelectorAll('[data-reveal], [data-reveal-text]').forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        observer.observe(el)
      })
    }

    root.classList.add('js-reveal')
    scan()
    const mutations = new MutationObserver(scan)
    mutations.observe(root, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      observer.disconnect()
      timers.forEach(clearTimeout)
      root.classList.remove('js-reveal')
    }
  }, [ref])
}
