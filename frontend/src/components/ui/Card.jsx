import { Link } from 'react-router-dom'

import { thumbUrl } from '../../utils/media'
import './Card.css'

/**
 * Card dùng chung cho tin tức / dự án.
 *
 * @param {{to?: string, media?: object, tag?: string, title: string, meta?: string, excerpt?: string}} props
 *   `media` là object { url, thumb, alt } — Card tự chọn bản thu nhỏ.
 */
export default function Card({ to, media, tag, title, meta, excerpt }) {
  const Wrapper = to ? Link : 'article'
  const wrapperProps = to ? { to } : {}
  const image = thumbUrl(media)

  return (
    <Wrapper className="card" {...wrapperProps}>
      <div className="card__media">
        {image ? (
          <img src={image} alt={media?.alt || ''} loading="lazy" decoding="async" />
        ) : (
          <div className="card__placeholder" aria-hidden="true" />
        )}
        {tag && <span className="card__tag">{tag}</span>}
      </div>
      <div className="card__body">
        {meta && <span className="card__meta">{meta}</span>}
        <h3 className="card__title">{title}</h3>
        {excerpt && <p className="card__excerpt">{excerpt}</p>}
      </div>
    </Wrapper>
  )
}
