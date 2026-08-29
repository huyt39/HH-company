import { formatDateTime } from '@/lib/utils/date-format'

/**
 * One inbox message; clicking the header expands the body.
 *
 * @param {{message: object, open: boolean, onToggle: () => void,
 *          onMarkUnread: () => void, onDelete: () => void}} props
 */
export function MessageRow({ message, open, onToggle, onMarkUnread, onDelete }) {
  const replySubject = encodeURIComponent(`Re: ${message.subject || 'Liên hệ từ website'}`)

  return (
    <article className={`message ${message.is_read ? '' : 'is-unread'}`}>
      <button type="button" className="message__head" onClick={onToggle}>
        <span className="message__from">
          {!message.is_read && <span className="message__dot" aria-label="Chưa đọc" />}
          {message.full_name}
        </span>
        <span className="message__subject">{message.subject || '(không có tiêu đề)'}</span>
        <span className="message__date">{formatDateTime(message.created_at)}</span>
      </button>

      {open && (
        <div className="message__body">
          <dl className="message__meta">
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${message.email}`}>{message.email}</a></dd>
            </div>
            <div><dt>Điện thoại</dt><dd>{message.phone || '—'}</dd></div>
          </dl>
          <p className="message__text">{message.message}</p>
          <div className="message__actions">
            <a className="btn btn--outline" href={`mailto:${message.email}?subject=${replySubject}`}>
              Trả lời qua email
            </a>
            <button type="button" className="btn btn--outline" onClick={onMarkUnread}>
              Đánh dấu chưa đọc
            </button>
            <button type="button" className="btn btn--danger" onClick={onDelete}>Xoá</button>
          </div>
        </div>
      )}
    </article>
  )
}
