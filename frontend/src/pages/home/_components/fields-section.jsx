import { Link } from 'react-router-dom'

import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { useLang } from '@/lib/i18n/language-context'

const MAX_ITEMS = 8

/** Trimmed grid of business fields, linking to the fields page. */
export function FieldsSection({ fields, loading, error }) {
  const { t } = useLang()

  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.fieldsEyebrow')}
          title={t('home.fieldsTitle')}
          description={t('home.fieldsDesc')}
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
          <Link to="/linh-vuc" className="btn btn--outline">{t('home.fieldsViewAll')}</Link>
        </div>
      </div>
    </section>
  )
}
