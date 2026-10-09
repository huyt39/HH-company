import { Link } from 'react-router-dom'

/** A mailto or, without an address on file, a link to the contact page. */
export function ApplyButton({ link, className, children }) {
  return link.external ? (
    <a href={link.href} className={className}>{children}</a>
  ) : (
    <Link to={link.href} className={className}>{children}</Link>
  )
}
