import { Link } from 'react-router-dom'

import { thumbUrl } from '@/lib/utils/media'

import { CardPlaceholder } from './card-placeholder'

import './card.css'

/**
 * Shared card for news and projects. `media` is { url, thumb, alt };
 * the card picks the thumbnail itself. `tagTone` colours the badge — omit it
 * for the default accent, as news categories and project years use.
 *
 * `duplicate` marks a copy of a card that is already on the page — the second
 * lap of a looping carousel — so it stays out of the accessibility tree and out
 * of the tab order. `badge` adds a short mark on the image, used to flag a
 * project whose record can be checked against an outside source.
 *
 * @param {{to?: string, media?: object, tag?: string, tagTone?: string, title: string, meta?: string, excerpt?: string, badge?: string, duplicate?: boolean}} props
 */
export function Card({ to, media, tag, tagTone, title, meta, excerpt, badge, duplicate = false }) {
  const Wrapper = to ? Link : 'article'
  const wrapperProps = to ? { to } : {}
  if (duplicate) {
    wrapperProps['aria-hidden'] = true
    wrapperProps.tabIndex = -1
  }
  const image = thumbUrl(media)

  return (
    <Wrapper className="card" {...wrapperProps}>
      <div className="card__media">
        {image ? (
          <img src={image} alt={media?.alt || ''} loading="lazy" decoding="async" />
        ) : (
          <CardPlaceholder seed={title} />
        )}
        {tag && (
          <span className={`card__tag ${tagTone ? `card__tag--${tagTone}` : ''}`}>{tag}</span>
        )}
        {/* Sits on the image, not under the text: at the foot of the card it
            floated free of its own entry and read as a label on the next one. */}
        {badge && (
          <span className="card__badge">
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M10 1.8 3 4.6v5.1c0 3.6 2.8 6.6 7 8.5 4.2-1.9 7-4.9 7-8.5V4.6L10 1.8Z" />
              <path className="card__badge-tick" d="M6.9 9.9 9 12l4.2-4.2" />
            </svg>
            {badge}
          </span>
        )}
      </div>
      <div className="card__body">
        {meta && <span className="card__meta">{meta}</span>}
        <h3 className="card__title">{title}</h3>
        {excerpt && <p className="card__excerpt">{excerpt}</p>}
      </div>
    </Wrapper>
  )
}
