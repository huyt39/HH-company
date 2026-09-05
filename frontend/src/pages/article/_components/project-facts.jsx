import { useLang } from '@/lib/i18n/language-context'

/** Quick facts about a project. */
export function ProjectFacts({ project }) {
  const { t } = useLang()
  const labels = t('article.factsLabels')

  return (
    <dl className="article__facts">
      <div><dt>{labels.year}</dt><dd>{project.year || '—'}</dd></div>
      <div><dt>{labels.location}</dt><dd>{project.location || '—'}</dd></div>
      <div><dt>{labels.status}</dt><dd>{project.status ? t(`projectStatus.${project.status}`) : '—'}</dd></div>
      <div className="article__facts--wide">
        <dt>{labels.investor}</dt><dd>{project.investor || '—'}</dd>
      </div>
      <div className="article__facts--wide">
        <dt>{labels.scope}</dt><dd>{project.scale || '—'}</dd>
      </div>
    </dl>
  )
}
