import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { DomainIcon } from '@/components/ui/domain-icon'
import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { SelectMenu } from '@/components/ui/select-menu'
import { StateBlock } from '@/components/ui/state-block'
import { productsApi } from '@/lib/api/products-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'
import { fullUrl } from '@/lib/utils/media'
import { normalize } from '@/lib/utils/search'

import './products-page.css'

const groupIndex = (index) => String(index + 1).padStart(2, '0')

export function ProductsPage() {
  const { t } = useLang()
  useDocumentMeta({ title: t('products.metaTitle'), description: t('products.metaDesc') })

  const [group, setGroup] = useState('')
  const [query, setQuery] = useState('')
  const { data, loading, error } = useFetch((options) => productsApi.getProducts(options), [])

  // The group number belongs to the catalogue, not to the current filter, so it
  // is fixed here before anything is filtered out.
  const groups = useMemo(
    () => (data ?? []).map((product, index) => ({ ...product, number: groupIndex(index) })),
    [data],
  )

  const visible = useMemo(() => {
    const term = normalize(query.trim())
    return groups.filter((product) => {
      if (group && product.slug !== group) return false
      if (!term) return true
      return [product.name, product.description, ...(product.specs ?? []), ...(product.applications ?? [])]
        .some((field) => normalize(field).includes(term))
    })
  }, [groups, group, query])

  return (
    <>
      <PageBanner title={t('products.bannerTitle')} subtitle={t('products.bannerSubtitle')} />

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            <SelectMenu
              value={group}
              onChange={setGroup}
              label={t('products.groupFilterLabel')}
              options={[
                { value: '', label: t('products.groupFilterAll') },
                ...groups.map((product) => ({ value: product.slug, label: product.name })),
              ]}
            />
            <label className="filter-bar__search">
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle cx="9" cy="9" r="6.5" fill="none" strokeWidth="1.8" />
                <line x1="13.6" y1="13.6" x2="18" y2="18" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder={t('products.searchPlaceholder')}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={t('products.searchAriaLabel')}
              />
            </label>
            {groups.length > 0 && (
              <span className="filter-bar__count">{t('products.count')(visible.length)}</span>
            )}
          </div>

          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!visible.length}
            skeletonCount={6}
            emptyTitle={groups.length ? t('products.noMatch') : t('products.empty')}
            emptyDescription={groups.length ? t('products.noMatchDesc') : undefined}
          >
            <div className="product-list">
              {visible.map((product) => (
                <article className="product-row" id={product.slug} key={product.id}>
                  <div className="product-row__head">
                    <span className="product-row__icon">
                      <DomainIcon slug={product.slug} kind="product" />
                    </span>
                    <div>
                      <span className="product-row__index">{t('products.group')(product.number)}</span>
                      <h2>{product.name}</h2>
                    </div>
                  </div>

                  <p className="text-muted">{product.description}</p>

                  {fullUrl(product.image) && (
                    <a
                      className="product-row__sheet"
                      href={fullUrl(product.image)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={fullUrl(product.image)}
                        alt={product.image.alt || product.name}
                        width={product.image.width || undefined}
                        height={product.image.height || undefined}
                        loading="lazy"
                        decoding="async"
                      />
                      <span>{t('products.viewOriginal')}</span>
                    </a>
                  )}

                  <div className="product-row__detail">
                    {product.specs?.length > 0 && (
                      <div>
                        <h3>{t('products.specsLabel')}</h3>
                        <ul className="bullet-list">
                          {product.specs.map((spec) => <li key={spec}>{spec}</li>)}
                        </ul>
                      </div>
                    )}
                    {product.applications?.length > 0 && (
                      <div>
                        <h3>{t('products.applicationsLabel')}</h3>
                        <ul className="tag-list">
                          {product.applications.map((app) => <li key={app}>{app}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </StateBlock>
        </div>
      </section>

      {/* Material paperwork moved here from the home page: it is the reason to
          trust the supply side, not the contracting side. */}
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow={t('products.assuranceEyebrow')}
            title={t('products.assuranceTitle')}
            description={t('products.assuranceDesc')}
          />
          <div className="commitments">
            {t('products.assuranceItems').map((item, index) => (
              <div className="commitment" key={item.title}>
                <span className="commitment__index">{String(index + 1).padStart(2, '0')}</span>
                <div className="commitment__body">
                  <h3>{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <SectionHeading
            eyebrow={t('products.supportEyebrow')}
            title={t('products.supportTitle')}
            description={t('products.supportDesc')}
            align="center"
          />
          <Link to="/lien-he" className="btn btn--primary">{t('products.supportCta')}</Link>
        </div>
      </section>
    </>
  )
}
