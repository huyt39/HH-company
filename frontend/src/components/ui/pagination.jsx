import { useLang } from '@/lib/i18n/language-context'

import './pagination.css'

/**
 * @param {{page: number, pageSize: number, total: number, onChange: (page: number) => void}} props
 */
export function Pagination({ page, pageSize, total, onChange }) {
  const { t } = useLang()
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label={t('pagination.ariaLabel')}>
      <button
        type="button"
        className="pagination__btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>

      {pages.map((value) => (
        <button
          key={value}
          type="button"
          aria-current={value === page ? 'page' : undefined}
          className={`pagination__btn ${value === page ? 'is-active' : ''}`}
          onClick={() => onChange(value)}
        >
          {value}
        </button>
      ))}

      <button
        type="button"
        className="pagination__btn"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </nav>
  )
}
