import { Link } from 'react-router-dom'

import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import Card from '../components/ui/Card'
import SectionHeading from '../components/ui/SectionHeading'
import StateBlock from '../components/ui/StateBlock'
import { formatBillion } from '../utils/format'
import './Home.css'
import { useDocumentMeta } from '../utils/useDocumentMeta'

const strengths = [
  {
    title: 'Hồ sơ pháp lý đầy đủ',
    text: 'Chứng chỉ xuất xứ, chứng nhận hệ thống quản lý ISO 9001, ISO 14001, ISO 45001 của nhà sản xuất và kết quả thí nghiệm vật liệu cho từng lô hàng.',
  },
  {
    title: 'Vật tư đạt tiêu chuẩn quốc tế',
    text: 'Sản phẩm được thí nghiệm theo ASTM A370, ASTM D412, ASTM E376, TCVN và tiêu chuẩn riêng của từng dự án.',
  },
  {
    title: 'Thi công và dịch vụ hiện trường',
    text: 'Đội ngũ kỹ thuật trực tiếp lắp đặt, căng kéo và hướng dẫn thi công tại công trường, không chỉ dừng ở khâu cung cấp.',
  },
  {
    title: 'Nguồn cung đa quốc gia',
    text: 'Hợp tác với các nhà sản xuất tại Nhật Bản, Italy và Trung Quốc, chủ động phương án thay thế khi nguồn cung biến động.',
  },
]

export default function Home() {
  useDocumentMeta({})

  const { data: fields, loading: fieldsLoading, error: fieldsError } = useFetch(
    (opts) => api.getFields(opts),
    [],
  )
  const { data: projects, loading: projectsLoading, error: projectsError } = useFetch(
    (opts) => api.getProjects({ page: 1, page_size: 6 }, opts),
    [],
  )
  const { data: news, loading: newsLoading, error: newsError } = useFetch(
    (opts) => api.getNews({ page: 1, page_size: 3 }, opts),
    [],
  )
  const { data: financials } = useFetch((opts) => api.getFinancials(opts), [])
  const { data: partners } = useFetch((opts) => api.getPartners({ role: 'customer' }, opts), [])
  const { data: profile } = useFetch((opts) => api.getProfile(opts), [])

  const latest = financials?.[financials.length - 1]
  const stats = [
    { value: '2013', label: 'Năm thành lập' },
    { value: `${projects?.total ?? '30'}+`, label: 'Dự án đã thực hiện' },
    { value: latest ? formatBillion(latest.revenue) : '—', label: `Doanh thu ${latest?.year ?? ''} (tỷ đồng)` },
    { value: profile?.employees?.replace(' nhân sự', '') ?? '25 – 99', label: 'Cán bộ nhân viên' },
  ]

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero__inner">
          <span className="hero__eyebrow">Hoa Hoang Intra Co., Ltd</span>
          <h1 className="hero__title">
            Hệ cáp dự ứng lực, gối cầu và khe co giãn<br />cho công trình hạ tầng giao thông
          </h1>
          <p className="hero__desc">
            Từ năm 2014, Hòa Hoàng cung cấp và thi công lắp đặt vật tư chuyên dụng cho các dự án
            cầu đường bộ, cao tốc và đường sắt trọng điểm trên cả nước.
          </p>
          <div className="hero__actions">
            <Link to="/san-pham" className="btn btn--primary">Xem sản phẩm</Link>
            <Link to="/du-an" className="btn btn--ghost-light">Dự án đã thực hiện</Link>
          </div>
        </div>

        <div className="hero__stats">
          <div className="container hero__stats-grid">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Giới thiệu ngắn ---------- */}
      <section className="section">
        <div className="container about-intro">
          <div>
            <SectionHeading
              eyebrow="Về chúng tôi"
              title="Nhà cung cấp chuyên ngành cầu đường"
              description="Công ty TNHH Đầu tư xây dựng và dịch vụ thương mại Hòa Hoàng chuyên cung cấp và thi công lắp đặt hệ cáp neo dự ứng lực ngoài, hệ cáp cho cầu dây võng, dây văng và cầu vòm, gối cầu và khe co giãn các loại."
            />
            <ul className="check-list">
              <li>Phân phối sản phẩm SHINKO (Nhật Bản), Hirun (Italy) và các thương hiệu hàng đầu Trung Quốc</li>
              <li>Chuyển giao công nghệ thi công dầm đường sắt tốc độ cao và hầm bằng máy TBM</li>
              <li>Tham gia cao tốc Sài Gòn – Long Thành – Dầu Giây, Bến Lức – Long Thành, Hà Nội – Lào Cai</li>
            </ul>
            <Link to="/gioi-thieu" className="btn btn--outline">Xem chi tiết</Link>
          </div>
          <div className="about-intro__media" aria-hidden="true">
            <div className="media-placeholder media-placeholder--tall" />
            <div className="media-placeholder" />
          </div>
        </div>
      </section>

      {/* ---------- Lĩnh vực hoạt động ---------- */}
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="Năng lực"
            title="Lĩnh vực hoạt động"
            description="Mười một lĩnh vực kinh doanh cốt lõi, từ cung cấp vật tư đến thi công và chuyển giao công nghệ."
            align="center"
          />
          <StateBlock
            loading={fieldsLoading}
            error={fieldsError}
            isEmpty={!fields?.length}
            skeletonCount={4}
          >
            <div className="grid grid--4">
              {fields?.slice(0, 8).map((field) => (
                <Link to={`/linh-vuc#${field.slug}`} className="field-card" key={field.id}>
                  <span className="field-card__icon" aria-hidden="true">{field.icon || '◆'}</span>
                  <h3>{field.name}</h3>
                  <p className="text-muted mb-0">{field.description}</p>
                </Link>
              ))}
            </div>
          </StateBlock>
          <div className="text-center" style={{ marginTop: 32 }}>
            <Link to="/linh-vuc" className="btn btn--outline">Tất cả lĩnh vực</Link>
          </div>
        </div>
      </section>

      {/* ---------- Thế mạnh ---------- */}
      <section className="section section--dark">
        <div className="container">
          <SectionHeading
            eyebrow="Cam kết"
            title="Vì sao chủ đầu tư chọn Hòa Hoàng"
            align="center"
            light
          />
          <div className="grid grid--2">
            {strengths.map((item, index) => (
              <div className="commitment" key={item.title}>
                <span className="commitment__index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p className="mb-0">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Dự án tiêu biểu ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <SectionHeading eyebrow="Kinh nghiệm" title="Dự án tiêu biểu" />
            <Link to="/du-an" className="btn btn--outline">Tất cả dự án</Link>
          </div>
          <StateBlock
            loading={projectsLoading}
            error={projectsError}
            isEmpty={!projects?.items?.length}
            emptyTitle="Chưa có dự án"
          >
            <div className="grid grid--3">
              {projects?.items?.map((project) => (
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

      {/* ---------- Khách hàng ---------- */}
      {partners?.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <SectionHeading
              eyebrow="Đối tác"
              title="Khách hàng đã hợp tác"
              align="center"
            />
            <ul className="partner-list">
              {partners.map((partner) => (
                <li className="partner-chip" key={partner.name}>{partner.name}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Tin tức ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <SectionHeading eyebrow="Truyền thông" title="Tin tức & sự kiện" />
            <Link to="/tin-tuc" className="btn btn--outline">Tất cả tin tức</Link>
          </div>
          <StateBlock
            loading={newsLoading}
            error={newsError}
            isEmpty={!news?.items?.length}
            emptyTitle="Chưa có bài viết"
          >
            <div className="grid grid--3">
              {news?.items?.map((item) => (
                <Card
                  key={item.id}
                  to={`/tin-tuc/${item.slug}`}
                  media={item.cover}
                  tag={item.category?.name}
                  title={item.title}
                  meta={item.published_at}
                  excerpt={item.excerpt}
                />
              ))}
            </div>
          </StateBlock>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta">
        <div className="container cta__inner">
          <div>
            <h2>Cần báo giá cho dự án của bạn?</h2>
            <p className="mb-0">Gửi yêu cầu về chủng loại và khối lượng, chúng tôi sẽ phản hồi cùng hồ sơ kỹ thuật.</p>
          </div>
          <Link to="/lien-he" className="btn btn--primary">Liên hệ ngay</Link>
        </div>
      </section>
    </>
  )
}
