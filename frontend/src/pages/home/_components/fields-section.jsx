import { Link } from 'react-router-dom'

import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'

const MAX_ITEMS = 8

/** Trimmed grid of business fields, linking to the fields page. */
export function FieldsSection({ fields, loading, error }) {
  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading
          eyebrow="Năng lực"
          title="Lĩnh vực hoạt động"
          description="Mười một lĩnh vực kinh doanh cốt lõi, từ cung cấp vật tư đến thi công và chuyển giao công nghệ."
          align="center"
        />
        <StateBlock loading={loading} error={error} isEmpty={!fields?.length} skeletonCount={4}>
          <div className="grid grid--4">
            {fields?.slice(0, MAX_ITEMS).map((field) => (
              <Link to={`/linh-vuc#${field.slug}`} className="field-card" key={field.id}>
                <span className="field-card__icon" aria-hidden="true">{field.icon || '◆'}</span>
                <h3>{field.name}</h3>
                <p className="text-muted mb-0">{field.description}</p>
              </Link>
            ))}
          </div>
        </StateBlock>
        <div className="text-center home-section__more">
          <Link to="/linh-vuc" className="btn btn--outline">Tất cả lĩnh vực</Link>
        </div>
      </div>
    </section>
  )
}
