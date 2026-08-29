import { Link } from 'react-router-dom'

import './not-found-page.css'

export function NotFoundPage() {
  return (
    <section className="section">
      <div className="container text-center not-found">
        <p className="not-found__code">404</p>
        <h1>Không tìm thấy trang</h1>
        <p className="text-muted">Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi.</p>
        <Link to="/" className="btn btn--primary">Về trang chủ</Link>
      </div>
    </section>
  )
}
