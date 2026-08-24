import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import PageBanner from '../components/ui/PageBanner'
import StateBlock from '../components/ui/StateBlock'
import './Fields.css'
import { useDocumentMeta } from '../utils/useDocumentMeta'

export default function Fields() {
  useDocumentMeta({ title: 'Lĩnh vực hoạt động', description: '11 lĩnh vực kinh doanh của Hòa Hoàng: hệ cáp dự ứng lực, gối cầu, khe co giãn, chuyển giao công nghệ đường sắt tốc độ cao.' })

  const { data, loading, error } = useFetch((opts) => api.getFields(opts), [])

  return (
    <>
      <PageBanner
        title="Lĩnh vực hoạt động"
        subtitle="Các lĩnh vực kinh doanh đăng ký và đang triển khai của công ty Hòa Hoàng."
        breadcrumb={[{ label: 'Lĩnh vực hoạt động' }]}
      />

      <section className="section">
        <div className="container">
          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!data?.length}
            skeletonCount={6}
            emptyTitle="Chưa có lĩnh vực nào"
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
