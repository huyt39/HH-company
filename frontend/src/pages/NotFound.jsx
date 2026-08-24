import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container text-center" style={{ paddingBlock: '60px' }}>
        <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--c-blue-100)', margin: 0 }}>404</p>
        <h1>Không tìm thấy trang</h1>
        <p className="text-muted">Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi.</p>
        <Link to="/" className="btn btn--primary">Về trang chủ</Link>
      </div>
    </section>
  )
}
