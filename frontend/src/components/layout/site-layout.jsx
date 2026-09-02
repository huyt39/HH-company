import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

/**
 * Scrolls to the element named by `#hash`. Anchor targets can mount after their
 * data arrives, so keep retrying briefly. Returns a cancel function.
 */
function scrollToHash(hash) {
  const id = decodeURIComponent(hash.slice(1))
  let attempts = 0
  let timer = 0

  const tryScroll = () => {
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    attempts += 1
    if (attempts < 25) timer = window.setTimeout(tryScroll, 100)
  }

  tryScroll()
  return () => window.clearTimeout(timer)
}

/** Public site shell: header + child route + footer. */
export function SiteLayout() {
  const { hash, key } = useLocation()

  // Jump to the anchor when there is one, otherwise start the page at the top.
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return undefined
    }
    return scrollToHash(hash)
  }, [hash, key])

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
