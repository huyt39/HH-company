import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

/** Public site shell: header + child route + footer. */
export function SiteLayout() {
  const { pathname, hash } = useLocation()

  // Reset scroll on navigation, except when jumping to an anchor.
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

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
