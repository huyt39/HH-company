import { useLayoutEffect } from 'react'

// Timings; must match the custom properties on `.js-reveal` in global.css.
const STAGGER_MS = 90 // between items of one group that come into view together
const MAX_STAGGER_STEPS = 6 // so a long batch never leaves the last item waiting
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
 *   a value (`data-reveal-stagger="220"`) sets that group's own gap in ms,
 *   and `data-reveal-sequence` on it plays all its children in order as soon
 *   as the first one shows, however slowly the page is scrolled;
 *   `data-reveal-duration` (ms) tells the hook how long that group's own CSS
 *   animation runs, so it is not cleaned up before it lands;
 * - `data-reveal-text` — a heading whose letters are `SplitText` spans.
 * Content that mounts later (a new route, cards after a fetch, a filter or a
 * page change) is picked up too.
 *
 * The stagger counts items of a group that enter the viewport together, not
 * their place in the list, so row 30 of a long list does not wait for 29 others.
 *
 * Only the container with `js-reveal` hides anything, and that class is added
 * here — so without JS, or with reduced motion, the page simply shows as is.
 * Once an element has played, its attributes are removed so its own transforms
 * and transitions (card hover lifts, carousels) work normally.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 */
export function useScrollReveal(ref) {
  // Layout effect, and a MutationObserver (whose callback runs before paint):
  // content is hidden before it is first drawn, so it animates in instead of
  // showing, vanishing and coming back.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timers = new Set()
    const groupOf = new WeakMap()

    const playTime = (el, delay) => {
      const own = Number(groupOf.get(el)?.dataset.revealDuration)
      if (!el.hasAttribute('data-reveal-text')) return delay + (own || BLOCK_MS)
      return delay + el.querySelectorAll('.split-char').length * CHAR_STEP_MS + CHAR_MS
    }

    const finish = (el) => {
      el.removeAttribute('data-reveal')
      el.removeAttribute('data-reveal-text')
      el.removeAttribute('data-revealed')
      el.style.removeProperty('--reveal-delay')
    }

    const reveal = (el, delay) => {
      observer.unobserve(el)
      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)
      el.setAttribute('data-revealed', '')
      const timer = setTimeout(() => {
        timers.delete(timer)
        finish(el)
      }, playTime(el, delay) + 100)
      timers.add(timer)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const batch = new Map() // group -> items of it revealed in this callback
        entries
          .filter((entry) => entry.isIntersecting && !entry.target.hasAttribute('data-revealed'))
          .forEach((entry) => {
            const el = entry.target
            const group = groupOf.get(el)
            const gap = Number(group?.dataset.revealStagger) || STAGGER_MS

            // A sequence plays the whole group, in its own order, at once.
            if (group?.hasAttribute('data-reveal-sequence')) {
              ;[...group.children]
                .filter(
                  (child) =>
                    groupOf.get(child) === group &&
                    child.hasAttribute('data-reveal') &&
                    !child.hasAttribute('data-revealed'),
                )
                .forEach((child, index) => reveal(child, index * gap))
              return
            }

            const step = group ? (batch.get(group) ?? 0) : 0
            if (group) batch.set(group, step + 1)
            reveal(el, Math.min(step, MAX_STAGGER_STEPS) * gap)
          })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    const seen = new WeakSet()
    const scan = () => {
      root.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
        ;[...group.children].forEach((child) => {
          if (seen.has(child) || groupOf.has(child)) return
          // A `display: contents` row has no box: it can neither fade nor be
          // seen by the observer. Animate the group as one block instead.
          if (getComputedStyle(child).display === 'contents') {
            group.setAttribute('data-reveal', '')
            return
          }
          groupOf.set(child, group)
          // A split heading keeps its letter animation; it only joins the order.
          if (!child.hasAttribute('data-reveal-text')) child.setAttribute('data-reveal', '')
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
