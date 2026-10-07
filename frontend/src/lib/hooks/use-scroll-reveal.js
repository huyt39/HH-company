import { useEffect } from 'react'

// Gap between items of one `data-reveal-stagger` group.
const STAGGER_MS = 90
// The CSS transition length; must match `--reveal-duration` in global.css.
const DURATION_MS = 850

/**
 * Fade blocks in as they scroll into view.
 *
 * Inside `ref`, an element with `data-reveal` animates on its own; the direct
 * children of a `data-reveal-stagger` element animate one after another. Content
 * that arrives later (cards after a fetch) is picked up too.
 *
 * Only the container with `js-reveal` hides anything, and that class is added
 * here — so without JS, or with reduced motion, the page simply shows as is.
 * Once an element has played, its reveal attributes are removed so its own
 * transforms and transitions (card hover lifts, carousels) work normally.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 */
export function useScrollReveal(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timers = new Set()

    const finish = (el) => {
      el.removeAttribute('data-reveal')
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
          const delay = parseInt(el.style.getPropertyValue('--reveal-delay'), 10) || 0
          const timer = setTimeout(() => {
            timers.delete(timer)
            finish(el)
          }, delay + DURATION_MS + 50)
          timers.add(timer)
        })
      },
      // Start a little before the element is fully in, as the reference does.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    const seen = new WeakSet()
    const scan = () => {
      root.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
        ;[...group.children].forEach((child, index) => {
          if (seen.has(child)) return
          child.setAttribute('data-reveal', '')
          child.style.setProperty('--reveal-delay', `${index * STAGGER_MS}ms`)
        })
      })
      root.querySelectorAll('[data-reveal]').forEach((el) => {
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
