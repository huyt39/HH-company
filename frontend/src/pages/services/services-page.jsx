import { Link } from 'react-router-dom'

import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { fieldsApi } from '@/lib/api/fields-client'
import { SERVICE_CATEGORIES } from '@/lib/constants/services'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import './services-page.css'

/** Anchor per category, so the header menu can jump straight to a group. */
const CATEGORY_ANCHORS = {
  build: 'thi-cong-moi',
  repair: 'sua-chua-tang-cuong',
  technology: 'cong-nghe-cung-cap',
}

export function ServicesPage() {
  const { t } = useLang()
  useDocumentMeta({ title: t('services.metaTitle'), description: t('services.metaDesc') })

  const { data, loading, error } = useFetch((options) => fieldsApi.getFields(options), [])

  // Anything with an unknown category still shows up, under "technology".
  const byCategory = (category) =>
    (data ?? []).filter((service) =>
      category === 'technology'
        ? !SERVICE_CATEGORIES.slice(0, 2).includes(service.category)
        : service.category === category,
    )

  return (
    <>
      <PageBanner title={t('services.bannerTitle')} subtitle={t('services.bannerSubtitle')} />

      <StateBlock
        loading={loading}
        error={error}
        isEmpty={!data?.length}
        skeletonCount={6}
        emptyTitle={t('services.empty')}
      >
        {SERVICE_CATEGORIES.map((category, index) => {
          const services = byCategory(category)
          if (!services.length) return null
          const copy = t('services.categories')[category]

          return (
            <section
              className={`section service-group ${index % 2 ? 'section--soft' : ''}`}
              id={CATEGORY_ANCHORS[category]}
              key={category}
            >
              <div className="container">
                <SectionHeading
                  eyebrow={copy.eyebrow}
                  title={copy.title}
                  description={copy.description}
                />
                <div className="service-list">
                  {services.map((service) => (
                    <Link
                      className="service-card"
                      to={`/dich-vu/${service.slug}`}
                      key={service.id}
                    >
                      <span className="service-card__icon" aria-hidden="true">
                        {service.icon || '◆'}
                      </span>
                      <div>
                        <h3>{service.name}</h3>
                        <p className="text-muted">{service.summary || service.description}</p>
                        <span className="service-card__more">{t('services.viewDetail')}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </StateBlock>

      <section className="cta">
        <div className="container cta__inner">
          <div>
            <h2>{t('services.ctaTitle')}</h2>
            <p className="mb-0">{t('services.ctaDesc')}</p>
          </div>
          <Link to="/lien-he" className="btn btn--primary">{t('services.ctaButton')}</Link>
        </div>
      </section>
    </>
  )
}
