import { PageBanner } from '@/components/ui/page-banner'
import { StateBlock } from '@/components/ui/state-block'
import { fieldsApi } from '@/lib/api/fields-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import './fields-page.css'

export function FieldsPage() {
  const { t } = useLang()
  useDocumentMeta({ title: t('fields.metaTitle'), description: t('fields.metaDesc') })

  const { data, loading, error } = useFetch((options) => fieldsApi.getFields(options), [])

  return (
    <>
      <PageBanner title={t('nav.fields')} subtitle={t('fields.bannerSubtitle')} />

      <section className="section">
        <div className="container">
          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!data?.length}
            skeletonCount={6}
            emptyTitle={t('fields.empty')}
          >
            <div className="field-list">
              {data?.map((field, index) => (
                <article className="field-item" id={field.slug} key={field.id}>
                  <span className="field-item__icon" aria-hidden="true">{field.icon || '◆'}</span>
                  <div>
                    <span className="field-item__index">{String(index + 1).padStart(2, '0')}</span>
                    <h2>{field.name}</h2>
                    <p className="text-muted mb-0">{field.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </StateBlock>
        </div>
      </section>
    </>
  )
}
