import { Link } from 'react-router-dom'

/**
 * Home hero with the highlight stats strip.
 *
 * @param {{stats: {value: string, label: string}[]}} props
 */
export function HeroSection({ stats }) {
  return (
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
  )
}
