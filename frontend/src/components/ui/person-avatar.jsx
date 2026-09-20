import { initialOf } from '@/lib/utils/initials'
import { fullUrl } from '@/lib/utils/media'

import './person-avatar.css'

/**
 * A person's portrait on the leadership and advisory cards.
 *
 * Until a photograph is on file the frame holds the initial of the given name.
 * Both states fill the same frame, and the frame is sized by the card, so
 * photographs can be added one at a time without the section being redrawn
 * around them — the reason the old 48px disc could not simply grow an image.
 *
 * Decorative either way: the name is in the heading beside it, and a portrait
 * announced again from the alt text would only repeat it.
 *
 * @param {{name: string, photo?: {url: string}, className?: string}} props
 */
export function PersonAvatar({ name, photo, className = '' }) {
  const src = fullUrl(photo)

  return (
    <span className={`person-avatar ${className}`.trim()} aria-hidden="true">
      {src ? <img src={src} alt="" loading="lazy" decoding="async" /> : initialOf(name)}
    </span>
  )
}
