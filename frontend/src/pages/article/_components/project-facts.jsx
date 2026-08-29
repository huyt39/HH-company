import { PROJECT_STATUS_LABEL } from '@/lib/constants/project-status'

/** Quick facts about a project. */
export function ProjectFacts({ project }) {
  return (
    <dl className="article__facts">
      <div><dt>Năm thực hiện</dt><dd>{project.year || '—'}</dd></div>
      <div><dt>Địa điểm</dt><dd>{project.location || '—'}</dd></div>
      <div><dt>Trạng thái</dt><dd>{PROJECT_STATUS_LABEL[project.status] || '—'}</dd></div>
      <div className="article__facts--wide">
        <dt>Khách hàng / nhà thầu</dt><dd>{project.investor || '—'}</dd>
      </div>
      <div className="article__facts--wide">
        <dt>Phạm vi cung cấp</dt><dd>{project.scale || '—'}</dd>
      </div>
    </dl>
  )
}
