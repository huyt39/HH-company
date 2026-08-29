import { Link } from 'react-router-dom'

/** Contact call-to-action at the bottom of the home page. */
export function QuoteCtaSection() {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <div>
          <h2>Cần báo giá cho dự án của bạn?</h2>
          <p className="mb-0">
            Gửi yêu cầu về chủng loại và khối lượng, chúng tôi sẽ phản hồi cùng hồ sơ kỹ thuật.
          </p>
        </div>
        <Link to="/lien-he" className="btn btn--primary">Liên hệ ngay</Link>
      </div>
    </section>
  )
}
