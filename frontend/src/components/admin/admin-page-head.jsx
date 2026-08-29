/**
 * Standard admin page header; `children` go in the right-hand action slot.
 *
 * @param {{title: string, meta?: string, children?: React.ReactNode}} props
 */
export function AdminPageHead({ title, meta, children }) {
  return (
    <header className="admin-page-head">
      <div>
        <h1>{title}</h1>
        {meta && <p className="admin-page-head__meta">{meta}</p>}
      </div>
      {children && <div className="admin-page-head__actions">{children}</div>}
    </header>
  )
}
