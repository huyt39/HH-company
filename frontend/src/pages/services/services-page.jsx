import { Link } from 'react-router-dom'

import { DomainIcon } from '@/components/ui/domain-icon'
import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { companyApi } from '@/lib/api/company-client'
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

/* Each group gets its own ground so the three read apart at a glance — on one
   background they were the same block of text three times over. */
const CATEGORY_GROUND = {
  build: 'section--dark',
  repair: '',
  technology: 'section--soft',
}

/** How many headline figures the opening block shows. */
const LEAD_STATS = 3

export function ServicesPage() {
  const { t, lang } = useLang()
  useDocumentMeta({ title: t('services.metaTitle'), description: t('services.metaDesc') })

  const { data, loading, error } = useFetch((options) => fieldsApi.getFields(options), [])
  const { data: profile } = useFetch((options) => companyApi.getProfile(options), [])
  const stats = (profile?.capability_stats ?? []).slice(0, LEAD_STATS)

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

      {/* A front door for the page: what the work is, and the record behind it,
          before the list of packages starts. */}
      <section className="section services-lead">
        <div className="container services-lead__grid">
          <div>
            <h2>{t('services.leadTitle')}</h2>
            <p className="text-muted">{t('services.leadDesc')}</p>
            <Link to="/lien-he" className="btn btn--primary">{t('services.leadCta')}</Link>
          </div>
          {stats.length > 0 && (
            <dl className="services-lead__figures">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.value}</dt>
                  <dd>{lang === 'en' && stat.label_en ? stat.label_en : stat.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <StateBlock
        loading={loading}
        error={error}
        isEmpty={!data?.length}
        skeletonCount={6}
        emptyTitle={t('services.empty')}
      >
        {SERVICE_CATEGORIES.map((category) => {
          const services = byCategory(category)
          if (!services.length) return null
          const copy = t('services.categories')[category]

          return (
            <section
              className={`section service-group ${CATEGORY_GROUND[category] ?? ''}`}
              id={CATEGORY_ANCHORS[category]}
              key={category}
            >
              <div className="container">
                <SectionHeading
                  eyebrow={copy.eyebrow}
                  title={copy.title}
                  description={copy.description}
                  light={category === 'build'}
                />
                <div className="service-list">
                  {services.map((service) => (
                    <Link
                      className="service-card"
                      to={`/dich-vu/${service.slug}`}
                      key={service.id}
                    >
                      <span className="service-card__icon">
                        <DomainIcon slug={service.slug} />
                      </span>
                      <h3>{service.name}</h3>
                      <p>{service.summary || service.description}</p>
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
