import { Link } from 'react-router-dom'

import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { productsApi } from '@/lib/api/products-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'

import './products-page.css'

const groupIndex = (index) => String(index + 1).padStart(2, '0')

export function ProductsPage() {
  useDocumentMeta({
    title: 'Sản phẩm',
    description:
      'Danh mục sản phẩm: cáp thành phẩm cho cầu dây văng, cáp dự ứng lực, neo DƯL, gối cầu, khe co giãn và thiết bị căng kéo.',
  })

  const { data, loading, error } = useFetch((options) => productsApi.getProducts(options), [])

  return (
    <>
      <PageBanner
        title="Sản phẩm cung cấp"
        subtitle="Vật tư và thiết bị chuyên dụng cho công trình cầu đường, nhập khẩu từ các nhà sản xuất Nhật Bản, Italy và Trung Quốc."
        breadcrumb={[{ label: 'Sản phẩm' }]}
      />

      <section className="section">
        <div className="container">
          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!data?.length}
            skeletonCount={6}
            emptyTitle="Chưa có sản phẩm"
          >
            <>
              <nav className="product-toc" aria-label="Danh mục sản phẩm">
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
                        <span className="product-row__index">Nhóm {groupIndex(index)}</span>
                        <h2>{product.name}</h2>
                      </div>
                    </div>

                    <p className="text-muted">{product.description}</p>

                    <div className="product-row__detail">
                      {product.specs?.length > 0 && (
                        <div>
                          <h3>Thông số / chủng loại</h3>
                          <ul className="bullet-list">
                            {product.specs.map((spec) => <li key={spec}>{spec}</li>)}
                          </ul>
                        </div>
                      )}
                      {product.applications?.length > 0 && (
                        <div>
                          <h3>Ứng dụng</h3>
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
            eyebrow="Hỗ trợ"
            title="Cần tư vấn chủng loại phù hợp?"
            description="Gửi thông số kỹ thuật của dự án, đội ngũ kỹ thuật sẽ đề xuất sản phẩm và cung cấp hồ sơ thí nghiệm tương ứng."
            align="center"
          />
          <Link to="/lien-he" className="btn btn--primary">Gửi yêu cầu báo giá</Link>
        </div>
      </section>
    </>
  )
}
