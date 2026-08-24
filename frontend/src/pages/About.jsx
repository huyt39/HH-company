import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import PageBanner from '../components/ui/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import './About.css'
import { useDocumentMeta } from '../utils/useDocumentMeta'

export default function About() {
  useDocumentMeta({ title: 'Giới thiệu', description: 'Tổng quan về Công ty Hòa Hoàng: lịch sử hình thành, tầm nhìn, ban lãnh đạo và cơ cấu tổ chức.' })

  const { data: profile } = useFetch((opts) => api.getProfile(opts), [])
  const { data: partners } = useFetch((opts) => api.getPartners({ role: 'manufacturer' }, opts), [])

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

  const [manager, ...departments] = profile?.org_units ?? []

  return (
    <>
      <PageBanner
        title="Giới thiệu"
        subtitle={profile?.tagline}
        breadcrumb={[{ label: 'Giới thiệu' }]}
      />

      {/* ---------- Tổng quan ---------- */}
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

      {/* ---------- Tầm nhìn / Sứ mệnh / Giá trị ---------- */}
      <section className="section section--soft" id="tam-nhin">
        <div className="container">
          <SectionHeading title="Tầm nhìn — Sứ mệnh — Giá trị cốt lõi" align="center" />
          <div className="grid grid--3">
            <div className="pillar">
              <h3>Tầm nhìn</h3>
              <p className="text-muted mb-0">{profile?.vision || 'Đang cập nhật.'}</p>
            </div>
            <div className="pillar">
              <h3>Sứ mệnh</h3>
              <p className="text-muted mb-0">{profile?.mission || 'Đang cập nhật.'}</p>
            </div>
            <div className="pillar">
              <h3>Giá trị cốt lõi</h3>
              <ul className="value-list mb-0">
                {profile?.core_values?.map((value) => <li key={value}>{value}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Ban lãnh đạo ---------- */}
      <section className="section" id="lanh-dao">
        <div className="container">
          <SectionHeading eyebrow="Con người" title="Ban lãnh đạo" align="center" />
          <div className="grid grid--2 leader-grid">
            {profile?.leaders?.map((leader) => (
              <div className="leader-card" key={leader.name}>
                <div className="leader-card__avatar" aria-hidden="true">
                  {leader.name.trim().split(' ').pop().charAt(0)}
                </div>
                <div>
                  <h3 className="mb-0">{leader.name}</h3>
                  <p className="text-muted mb-0">{leader.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Cơ cấu tổ chức ---------- */}
      <section className="section section--soft" id="co-cau">
        <div className="container">
          <SectionHeading eyebrow="Tổ chức" title="Cơ cấu tổ chức" align="center" />
          {manager && (
            <div className="org-chart">
              <div className="org-node org-node--root">
                <strong>{manager.name}</strong>
                <small>{manager.name_en}</small>
              </div>
              <div className="org-connector" aria-hidden="true" />
              <div className="org-row">
                {departments.map((unit) => (
                  <div className="org-branch" key={unit.name}>
                    <div className="org-node">
                      <strong>{unit.name}</strong>
                      <small>{unit.name_en}</small>
                    </div>
                    {unit.children?.map((child) => (
                      <div className="org-node org-node--child" key={child}>
                        <strong>{child}</strong>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---------- Lịch sử ---------- */}
      <section className="section" id="lich-su">
        <div className="container">
          <SectionHeading eyebrow="Chặng đường" title="Lịch sử phát triển" align="center" />
          <ol className="timeline">
            {profile?.milestones?.map((item) => (
              <li className="timeline__item" key={item.year}>
                <span className="timeline__year">{item.year}</span>
                <div className="timeline__content">
                  <h3>{item.title}</h3>
                  <p className="text-muted mb-0">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Nhà sản xuất ---------- */}
      {partners?.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <SectionHeading
              eyebrow="Nguồn cung"
              title="Nhà sản xuất hợp tác"
              description="Hòa Hoàng là đơn vị nhập khẩu và phân phối sản phẩm của các nhà sản xuất sau."
              align="center"
            />
            <div className="grid grid--3">
              {partners.map((partner) => (
                <div className="manufacturer" key={partner.name}>
                  <strong>{partner.name}</strong>
                  <span className="text-muted">{partner.country}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
