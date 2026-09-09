import { useLang } from '@/lib/i18n/language-context'

/** Hostname without www, e.g. "vnexpress.net" — shown so the reader can judge
 *  the source at a glance. Returns null for anything unparseable. */
function sourceHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

/**
 * "Project context" box: background gathered from public sources.
 *
 * The citation is the point of this box, not a footnote to it. A main
 * contractor checking a reference can follow the link to a newspaper or a
 * ministry page and confirm the job exists independently of anything this site
 * claims — so the source gets its own block, with the publisher named.
 */
export function ProjectContext({ context, sourceUrl }) {
  const { t } = useLang()
  if (!context && !sourceUrl) return null

  const host = sourceUrl ? sourceHost(sourceUrl) : null

  return (
    <aside className="context-box">
      {context && (
        <>
          <h2>{t('article.contextTitle')}</h2>
          <p>{context}</p>
        </>
      )}

      {sourceUrl && (
        <a
          className="context-box__source"
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M10 1.8 3 4.6v5.1c0 3.6 2.8 6.6 7 8.5 4.2-1.9 7-4.9 7-8.5V4.6L10 1.8Z" />
            <path className="context-box__tick" d="M6.9 9.9 9 12l4.2-4.2" />
          </svg>
          <span>
            <strong>{t('article.contextSourceLabel')}</strong>
            {host && <span className="context-box__host">{host}</span>}
          </span>
        </a>
      )}

      {context && <p className="context-box__note">{t('article.contextNote')}</p>}
    </aside>
  )
}
