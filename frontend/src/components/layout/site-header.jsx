import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { SITE_NAVIGATION } from '@/lib/constants/site-navigation'
import { useLang } from '@/lib/i18n/language-context'

import './site-header.css'

/**
 * Collapsing the topbar removes 36px from a header that sits in the document
 * flow, so the page jumps. With a single threshold the two states chase each
 * other: hiding the bar shortens the document, the browser clamps the scroll
 * back under the threshold, the bar returns, and the header flickers. These two
 * values leave a dead zone wide enough that neither momentum scrolling nor the
 * clamp can cross back over.
 */
const COLLAPSE_TOPBAR_AT = 72
const RESTORE_TOPBAR_AT = 8

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { lang, setLang, t } = useLang()

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      const y = window.scrollY
      setScrolled((wasScrolled) => (wasScrolled ? y > RESTORE_TOPBAR_AT : y > COLLAPSE_TOPBAR_AT))
    }

    // One read per frame: scroll fires far more often than the page can paint.
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  // Close the mobile menu on every navigation.
  useEffect(() => setMenuOpen(false), [location.pathname, location.hash, location.key])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__topbar">
        <div className="container site-header__topbar-inner">
          <span>{t('common.hotline')} 024 2200 8708</span>
          <div className="site-header__topbar-links">
            <a href="mailto:vnhoahoang@gmail.com">vnhoahoang@gmail.com</a>
            <span aria-hidden="true">|</span>
            <div className="lang-switch" role="group" aria-label={t('nav.ariaLanguage')}>
              <button
                type="button"
                className={lang === 'vi' ? 'is-active' : ''}
                onClick={() => setLang('vi')}
              >
                VI
              </button>
              <button
                type="button"
                className={lang === 'en' ? 'is-active' : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container site-header__main">
        <Link to="/" className="brand" aria-label={t('nav.ariaHome')}>
          <img className="brand__logo" src="/logo.png" alt="" width="44" height="44" />
          <span className="brand__text">
            <strong>HÒA HOÀNG</strong>
            <small>HOA HOANG INTRA CO., LTD</small>
          </span>
        </Link>

        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label={t('nav.ariaMain')}>
          <ul className="site-nav__list">
            {SITE_NAVIGATION.map((item) => (
              <li key={item.to} className={item.children ? 'has-children' : ''}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `site-nav__link ${isActive ? 'is-active' : ''}`}
                >
                  {t(`nav.${item.labelKey}`)}
                </NavLink>

                {item.children && (
                  <ul className="site-nav__submenu">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link to={child.to}>{t(`nav.${child.labelKey}`)}</Link>
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
          aria-label={t('nav.ariaMenuToggle')}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
