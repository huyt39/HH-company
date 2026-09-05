import { Link } from 'react-router-dom'

import { useLang } from '@/lib/i18n/language-context'

/**
 * Quick facts about a project.
 *
 * `role` is stated first and plainly: a supply order should not read as site
 * work, and a main contractor checking references will look for exactly this.
 */
export function ProjectFacts({ project }) {
  const { t } = useLang()
  const labels = t('article.factsLabels')
  const workTypeLabels = t('workTypes')

  return (
    <>
      <dl className="article__facts">
        <div><dt>{labels.year}</dt><dd>{project.year || '—'}</dd></div>
        <div><dt>{labels.location}</dt><dd>{project.location || '—'}</dd></div>
        <div><dt>{labels.status}</dt><dd>{project.status ? t(`projectStatus.${project.status}`) : '—'}</dd></div>
        <div>
          <dt>{labels.role}</dt>
          <dd>{project.role ? t(`projectRole.${project.role}`) : '—'}</dd>
        </div>
        {/* Spans the leftover track so the 3-column grid has no empty cell. */}
        <div className="article__facts--span2">
          <dt>{labels.structureType}</dt>
          <dd>{project.structure_type || '—'}</dd>
        </div>
        <div className="article__facts--wide">
          <dt>{labels.investor}</dt><dd>{project.investor || '—'}</dd>
        </div>
        <div className="article__facts--wide">
          <dt>{labels.scope}</dt><dd>{project.scale || '—'}</dd>
        </div>
      </dl>

      {project.work_types?.length > 0 && (
        <div className="article__work-types">
          <span className="article__work-types-label">{labels.workTypes}</span>
          {project.work_types.map((workType) => (
            <Link className="chip" to={`/dich-vu/${workType}`} key={workType}>
              {workTypeLabels[workType] ?? workType}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
