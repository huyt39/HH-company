import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'

import { messagesApi } from '@/lib/api/messages-client'
import { useAuth } from '@/lib/auth/auth-context'
import { ADMIN_NAVIGATION } from '@/lib/constants/admin-navigation'

/** Admin shell: blocks anonymous visitors, renders sidebar + child route. */
export function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const [unread, setUnread] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    messagesApi.getUnreadCount().then((data) => setUnread(data.count)).catch(() => {})
  }, [user, location.pathname])

  useEffect(() => setMenuOpen(false), [location.pathname])

  if (loading) return <div className="admin-boot">Đang tải…</div>
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />

  return (
    <div className={`admin-shell ${menuOpen ? 'is-menu-open' : ''}`}>
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-sidebar__brand">
          <span className="brand__mark" aria-hidden="true">H</span>
          <div>
            <strong>HÒA HOÀNG</strong>
            <small>Quản trị nội dung</small>
          </div>
        </Link>

        <nav className="admin-nav">
          {ADMIN_NAVIGATION.map((item, index) =>
            item.section ? (
              <p className="admin-nav__section" key={`section-${index}`}>{item.section}</p>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) => `admin-nav__link ${isActive ? 'is-active' : ''}`}
              >
                {item.label}
                {item.badge === 'unread' && unread > 0 && (
                  <span className="admin-nav__badge">{unread}</span>
                )}
              </NavLink>
            ),
          )}
        </nav>

        <div className="admin-sidebar__foot">
          <a href="/" target="_blank" rel="noopener noreferrer">Xem website ↗</a>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__toggle"
            aria-label="Mở menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
          <span className="admin-topbar__user">{user.email}</span>
          <button type="button" className="admin-topbar__logout" onClick={logout}>
            Đăng xuất
          </button>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      <button
        type="button"
        className="admin-backdrop"
        aria-label="Đóng menu"
        onClick={() => setMenuOpen(false)}
      />
    </div>
  )
}
