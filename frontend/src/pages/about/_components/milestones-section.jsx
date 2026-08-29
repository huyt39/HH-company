import { SectionHeading } from '@/components/ui/section-heading'

export function MilestonesSection({ milestones }) {
  return (
    <section className="section" id="lich-su">
      <div className="container">
        <SectionHeading eyebrow="Chặng đường" title="Lịch sử phát triển" align="center" />
        <ol className="timeline">
          {milestones?.map((item) => (
            <li className="timeline__item" key={item.year}>
              <span className="timeline__year">{item.year}</span>
              <div className="timeline__content">
                <h3>{item.title}</h3>
                <p className="text-muted mb-0">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
