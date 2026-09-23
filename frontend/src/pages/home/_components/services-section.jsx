import { Link } from 'react-router-dom'

import { DomainIcon } from '@/components/ui/domain-icon'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { useLang } from '@/lib/i18n/language-context'

/** Two columns per group keeps the home page short; the rest is one click away. */
const MAX_PER_GROUP = 4

const GROUPS = [
  {
    category: 'build',
    anchor: 'thi-cong-moi',
    image: '/images/cong-truong/thiet-bi-cang-keo-du-ung-luc-tai-cong-truong-e86fd45e.jpg',
  },
  {
    category: 'repair',
    anchor: 'sua-chua-tang-cuong',
    image: '/images/cau-long-thanh-khe-co-gian-p26/sua-chua-khe-co-gian-cau-long-thanh-cc6ca3fb.jpg',
  },
]

/**
 * What Hoa Hoang does on site, as two doorways: new build and repair.
 *
 * The split is how the trade's international peers organise the same work, and
 * it matches how the two kinds of client arrive — a main contractor building a
 * new span and a road authority maintaining one in service are after different
 * things and should not have to read past each other's work to find it.
 */
export function ServicesSection({ services, loading, error }) {
  const { t } = useLang()

  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.servicesEyebrow')}
          title={t('home.servicesTitle')}
          description={t('home.servicesDesc')}
          align="center"
          largeEyebrow
        />
        <StateBlock loading={loading} error={error} isEmpty={!services?.length} skeletonCount={4}>
          <div className="service-groups">
            {GROUPS.map((group) => {
              const items = (services ?? [])
                .filter((service) => service.category === group.category)
                .slice(0, MAX_PER_GROUP)
              if (!items.length) return null

              const copy = t('services.categories')[group.category]

              return (
                <div className="service-group-card" key={group.category}>
                  <div className="service-group-card__media" aria-hidden="true">
                    <img src={group.image} alt="" loading="lazy" decoding="async" />
                  </div>
                  <span className="service-group-card__eyebrow">{copy.eyebrow}</span>
                  <h3 className="service-group-card__title">{copy.title}</h3>
                  <p className="service-group-card__desc">{copy.description}</p>
                  <ul className="service-group-card__list">
                    {items.map((service) => (
                      <li key={service.id}>
                        <Link to={`/dich-vu/${service.slug}`}>
                          <DomainIcon slug={service.slug} />
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link to={`/dich-vu#${group.anchor}`} className="service-group-card__more">
                    {t('home.servicesGroupMore')}
                  </Link>
                </div>
              )
            })}
          </div>
        </StateBlock>
        <div className="text-center home-section__more">
          <Link to="/dich-vu" className="btn btn--outline">{t('home.servicesViewAll')}</Link>
        </div>
      </div>
    </section>
  )
}
