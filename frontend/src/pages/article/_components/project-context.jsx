import { useLang } from '@/lib/i18n/language-context'

/** "Project context" box: background gathered from public sources. */
export function ProjectContext({ context, sourceUrl }) {
  const { t } = useLang()
  if (!context) return null

  return (
    <aside className="context-box">
      <h2>{t('article.contextTitle')}</h2>
      <p>{context}</p>
      <p className="context-box__note">
        {t('article.contextNote')}
        {sourceUrl && (
          <>
            {' '}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{t('article.contextViewSource')}</a>
          </>
        )}
      </p>
    </aside>
  )
}
