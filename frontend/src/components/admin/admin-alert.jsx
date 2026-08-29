/**
 * Short admin notice.
 *
 * @param {{tone?: 'ok' | 'error' | 'info', children: React.ReactNode}} props
 */
export function AdminAlert({ tone = 'info', children }) {
  if (!children) return null
  return <p className={`admin-alert admin-alert--${tone}`}>{children}</p>
}
