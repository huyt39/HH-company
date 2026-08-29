import { Link } from 'react-router-dom'

import { SectionHeading } from '@/components/ui/section-heading'

const HIGHLIGHTS = [
  'Phân phối sản phẩm SHINKO (Nhật Bản), Hirun (Italy) và các thương hiệu hàng đầu Trung Quốc',
  'Chuyển giao công nghệ thi công dầm đường sắt tốc độ cao và hầm bằng máy TBM',
  'Tham gia cao tốc Sài Gòn – Long Thành – Dầu Giây, Bến Lức – Long Thành, Hà Nội – Lào Cai',
]

/** Short company intro on the home page. */
export function AboutIntroSection() {
  return (
    <section className="section">
      <div className="container about-intro">
        <div>
          <SectionHeading
            eyebrow="Về chúng tôi"
            title="Nhà cung cấp chuyên ngành cầu đường"
            description="Công ty TNHH Đầu tư xây dựng và dịch vụ thương mại Hòa Hoàng chuyên cung cấp và thi công lắp đặt hệ cáp neo dự ứng lực ngoài, hệ cáp cho cầu dây võng, dây văng và cầu vòm, gối cầu và khe co giãn các loại."
          />
          <ul className="check-list">
            {HIGHLIGHTS.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <Link to="/gioi-thieu" className="btn btn--outline">Xem chi tiết</Link>
        </div>
        <div className="about-intro__media">
          <img
            className="about-intro__photo about-intro__photo--tall"
            src="/images/cong-truong/ky-su-hoa-hoang-tai-cong-truong-6e4c117f.jpg"
            alt="Kỹ sư Hòa Hoàng tại công trường cầu lúc hoàng hôn"
            width="1349"
            height="1600"
            loading="lazy"
            decoding="async"
          />
          <img
            className="about-intro__photo"
            src="/images/cong-truong/thiet-bi-cang-keo-du-ung-luc-tai-cong-truong-e86fd45e.jpg"
            alt="Bộ nguồn thủy lực điều khiển căng kéo cáp dự ứng lực tại công trường"
            width="1200"
            height="1600"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
