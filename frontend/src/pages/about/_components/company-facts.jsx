import { SectionHeading } from '@/components/ui/section-heading'

/** Overview: intro paragraphs on the left, legal details on the right. */
export function CompanyFacts({ profile }) {
  const facts = [
    { label: 'Tên đầy đủ', value: profile?.name },
    { label: 'Tên tiếng Anh', value: profile?.name_en },
    { label: 'Tên viết tắt', value: profile?.short_name },
    { label: 'Mã số doanh nghiệp', value: profile?.tax_code },
    { label: 'Năm thành lập', value: profile?.established },
    { label: 'Vốn điều lệ', value: profile?.charter_capital },
    { label: 'Ngành nghề chính', value: profile?.main_business_line },
    {
      label: 'Số ngành nghề đăng ký',
      value: profile?.business_lines_count ? `${profile.business_lines_count} ngành` : null,
    },
    { label: 'Quy mô nhân sự', value: profile?.employees },
    { label: 'Tình trạng', value: profile?.status },
  ]

  return (
    <section className="section">
      <div className="container about-grid">
        <div>
          <SectionHeading eyebrow="Tổng quan" title="Đôi nét về Hòa Hoàng" />
          {profile?.intro?.map((paragraph, index) => (
            <p className="text-muted" key={index}>{paragraph}</p>
          ))}
        </div>
        <dl className="fact-card">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value || 'Đang cập nhật'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
