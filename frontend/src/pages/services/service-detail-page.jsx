import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { fieldsApi } from '@/lib/api/fields-client'
import { projectsApi } from '@/lib/api/projects-client'
import { PROJECT_STATUS_TONE } from '@/lib/constants/project-status'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import './services-page.css'

// The whole project list is small enough to filter in the browser, which keeps
// the API free of a work-type query it would only ever serve to this page.
const PROJECT_FETCH_SIZE = 100
const MAX_RELATED = 6

export function ServiceDetailPage() {
  const { slug } = useParams()
  const { t } = useLang()

  const { data: service, loading, error } = useFetch(
    (options) => fieldsApi.getField(slug, options),
    [slug],
  )
  const { data: projectPage } = useFetch(
    (options) => projectsApi.getProjects({ page: 1, page_size: PROJECT_FETCH_SIZE }, options),
    [],
  )

  useDocumentMeta({
    title: service?.name,
    description: service?.summary || service?.description,
  })

  const relatedProjects = useMemo(() => {
    const workType = service?.work_type || slug
    return (projectPage?.items ?? [])
      .filter((project) => project.work_types?.includes(workType))
      .slice(0, MAX_RELATED)
  }, [projectPage, service, slug])

  if (loading) return <PageBanner title={t('common.loadingEllipsis')} />
  if (error || !service) {
    return (
      <>
        <PageBanner title={t('services.notFoundTitle')} />
        <section className="section">
          <div className="container">
            <Link to="/dich-vu" className="btn btn--outline">{t('services.backToList')}</Link>
          </div>
        </section>
      </>
    )
  }

  const categoryCopy = t('services.categories')[service.category] ?? t('services.categories').technology
  const blocks = [
    { key: 'process', title: t('services.processTitle'), items: service.process_steps, ordered: true },
    { key: 'standards', title: t('services.standardsTitle'), items: service.standards },
    { key: 'deliverables', title: t('services.deliverablesTitle'), items: service.deliverables },
  ].filter((block) => block.items?.length)

  return (
    <>
      <PageBanner
        title={service.name}
        subtitle={service.summary}
        breadcrumb={[
          { label: t('nav.services'), to: '/dich-vu' },
          { label: categoryCopy.title, to: '/dich-vu' },
          { label: service.name },
        ]}
      />

      <section className="section">
        <div className="container service-detail">
          <div className="service-detail__intro">
            <p className="text-muted">{service.description}</p>
          </div>

          {blocks.map((block) => (
            <div className="service-block" key={block.key}>
              <h2>{block.title}</h2>
              {block.ordered ? (
                <ol className="service-steps">
                  {block.items.map((item, index) => (
                    <li key={item}>
                      <span className="service-steps__index">{String(index + 1).padStart(2, '0')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="check-list">
                  {block.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}

          <p className="service-detail__note text-muted">{t('services.standardsNote')}</p>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <SectionHeading
              eyebrow={t('services.relatedEyebrow')}
              title={t('services.relatedTitle')}
            />
            <div className="grid grid--3">
              {relatedProjects.map((project) => (
                <Card
                  key={project.id}
                  to={`/du-an/${project.slug}`}
                  media={project.cover}
                  tag={t(`projectStatus.${project.status}`)}
                  tagTone={PROJECT_STATUS_TONE[project.status]}
                  title={project.name}
                  meta={project.location}
                  excerpt={project.summary}
                />
              ))}
            </div>
            <div className="text-center home-section__more">
              <Link to="/du-an" className="btn btn--outline">{t('services.relatedViewAll')}</Link>
            </div>
          </div>
        </section>
      )}

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
