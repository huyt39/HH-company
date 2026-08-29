import './state-block.css'

/** Skeleton placeholder while a list loads. */
export function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid grid--3">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton--media" />
          <div className="skeleton-card__body">
            <div className="skeleton skeleton--line" style={{ width: '35%' }} />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" style={{ width: '70%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Shown when the API returns no data. */
export function EmptyState({
  title = 'Chưa có dữ liệu',
  description = 'Nội dung đang được cập nhật.',
}) {
  return (
    <div className="state-block">
      <div className="state-block__icon" aria-hidden="true">◔</div>
      <h3>{title}</h3>
      <p className="text-muted mb-0">{description}</p>
    </div>
  )
}

/** Shown when the API call fails. */
export function ErrorState({ error }) {
  return (
    <div className="state-block state-block--error">
      <div className="state-block__icon" aria-hidden="true">!</div>
      <h3>Không tải được dữ liệu</h3>
      <p className="text-muted mb-0">{error?.message || 'Vui lòng thử lại sau.'}</p>
    </div>
  )
}

/**
 * Combines the loading / error / empty states of a list.
 *
 * @param {{loading: boolean, error: any, isEmpty: boolean, skeletonCount?: number,
 *          emptyTitle?: string, children: React.ReactNode}} props
 */
export function StateBlock({ loading, error, isEmpty, skeletonCount = 3, emptyTitle, children }) {
  if (loading) return <SkeletonGrid count={skeletonCount} />
  if (error) return <ErrorState error={error} />
  if (isEmpty) return <EmptyState title={emptyTitle} />
  return children
}
