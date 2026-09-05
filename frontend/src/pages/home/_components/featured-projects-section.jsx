import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { useLang } from '@/lib/i18n/language-context'

/** Featured projects on the home page. */
export function FeaturedProjectsSection({ projects, loading, error }) {
  const { t } = useLang()

  return (
    <section className="section">
      <div className="container">
        <div className="section-head-row">
          <SectionHeading eyebrow={t('home.featuredProjectsEyebrow')} title={t('home.featuredProjectsTitle')} />
          <Link to="/du-an" className="btn btn--outline">{t('home.featuredProjectsViewAll')}</Link>
        </div>
        <StateBlock
          loading={loading}
          error={error}
          isEmpty={!projects?.length}
          emptyTitle={t('home.featuredProjectsEmpty')}
        >
          <div className="grid grid--3">
            {projects?.map((project) => (
              <Card
                key={project.id}
                to={`/du-an/${project.slug}`}
                media={project.cover}
                tag={String(project.year)}
                title={project.name}
                meta={project.location}
                excerpt={project.summary}
              />
            ))}
          </div>
        </StateBlock>
      </div>
    </section>
  )
}
