import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Reset scroll khi đổi trang, trừ khi điều hướng tới anchor.
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
