/** "Project context" box: background gathered from public sources. */
export function ProjectContext({ context, sourceUrl }) {
  if (!context) return null

  return (
    <aside className="context-box">
      <h2>Bối cảnh dự án</h2>
      <p>{context}</p>
      <p className="context-box__note">
        Thông tin tổng hợp từ nguồn tin công khai, không thuộc phạm vi công việc của Hòa Hoàng.
        {sourceUrl && (
          <>
            {' '}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Xem nguồn ↗</a>
          </>
        )}
      </p>
    </aside>
  )
}
