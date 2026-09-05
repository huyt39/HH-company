import { Link } from 'react-router-dom'

import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { productsApi } from '@/lib/api/products-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'
import { fullUrl } from '@/lib/utils/media'

import './products-page.css'

const groupIndex = (index) => String(index + 1).padStart(2, '0')

export function ProductsPage() {
  const { t } = useLang()
  useDocumentMeta({ title: t('products.metaTitle'), description: t('products.metaDesc') })

  const { data, loading, error } = useFetch((options) => productsApi.getProducts(options), [])

  return (
    <>
      <PageBanner title={t('products.bannerTitle')} subtitle={t('products.bannerSubtitle')} />

      <section className="section">
        <div className="container">
          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!data?.length}
            skeletonCount={6}
            emptyTitle={t('products.empty')}
          >
            <>
              <nav className="product-toc" aria-label={t('products.tocAriaLabel')}>
                {data?.map((product, index) => (
                  <a href={`#${product.slug}`} key={product.slug}>
                    <span aria-hidden="true">{groupIndex(index)}</span>
                    {product.name}
                  </a>
                ))}
              </nav>

              <div className="product-list">
                {data?.map((product, index) => (
                  <article className="product-row" id={product.slug} key={product.id}>
                    <div className="product-row__head">
                      <span className="product-row__icon" aria-hidden="true">{product.icon || '◆'}</span>
                      <div>
                        <span className="product-row__index">{t('products.group')(groupIndex(index))}</span>
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
            </>
          </StateBlock>
        </div>
      </section>

      <section className="section section--soft">
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
