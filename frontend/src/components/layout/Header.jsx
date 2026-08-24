import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { navigation } from './navigation'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Đóng menu mobile mỗi khi chuyển trang.
  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__topbar">
        <div className="container site-header__topbar-inner">
          <span>Hotline: 024 2200 8708</span>
          <div className="site-header__topbar-links">
            <a href="mailto:vnhoahoang@gmail.com">vnhoahoang@gmail.com</a>
            <span aria-hidden="true">|</span>
            <button type="button" className="lang-switch">VI</button>
          </div>
        </div>
      </div>

      <div className="container site-header__main">
        <Link to="/" className="brand" aria-label="Về trang chủ">
          <img className="brand__logo" src="/logo.png" alt="" width="44" height="44" />
          <span className="brand__text">
            <strong>HÒA HOÀNG</strong>
            <small>HOA HOANG INTRA CO., LTD</small>
          </span>
        </Link>

        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Điều hướng chính">
          <ul className="site-nav__list">
            {navigation.map((item) => (
              <li key={item.to} className={item.children ? 'has-children' : ''}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `site-nav__link ${isActive ? 'is-active' : ''}`}
                >
                  {item.label}
                </NavLink>

                {item.children && (
                  <ul className="site-nav__submenu">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link to={child.to}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-label="Mở menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
