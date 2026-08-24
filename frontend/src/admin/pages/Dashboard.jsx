import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { adminApi } from '../adminApi'

const CARDS = [
  { resource: 'projects', label: 'Dự án', to: '/admin/projects' },
  { resource: 'products', label: 'Nhóm sản phẩm', to: '/admin/products' },
  { resource: 'fields', label: 'Lĩnh vực hoạt động', to: '/admin/fields' },
  { resource: 'news', label: 'Bài viết', to: '/admin/news' },
  { resource: 'careers', label: 'Tin tuyển dụng', to: '/admin/careers' },
  { resource: 'partners', label: 'Khách hàng & đối tác', to: '/admin/partners' },
]

export default function Dashboard() {
  const [counts, setCounts] = useState({})
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    Promise.all(
      CARDS.map((card) =>
        adminApi
          .list(card.resource, { page_size: 1 })
          .then((d) => [card.resource, d.total])
          .catch(() => [card.resource, null]),
      ),
    ).then((entries) => setCounts(Object.fromEntries(entries)))

    adminApi.unreadCount().then((r) => setUnread(r.count)).catch(() => {})
  }, [])

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Tổng quan</h1>
          <p className="admin-page-head__meta">Quản trị nội dung website Hòa Hoàng</p>
        </div>
      </header>

      {unread > 0 && (
        <p className="admin-alert admin-alert--info">
          Có <strong>{unread}</strong> tin nhắn liên hệ chưa đọc.{' '}
          <Link to="/admin/messages">Xem hộp thư →</Link>
        </p>
      )}

      <div className="stat-cards">
        {CARDS.map((card) => (
          <Link className="stat-card" to={card.to} key={card.resource}>
            <strong>{counts[card.resource] ?? '—'}</strong>
            <span>{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="admin-card">
        <h2>Hướng dẫn nhanh</h2>
        <ul className="guide-list">
          <li><strong>Ẩn/hiện nhanh:</strong> bấm vào nhãn “Đang hiện / Đang ẩn” trong bảng để bật tắt mà không cần mở form.</li>
          <li><strong>Thứ tự hiển thị:</strong> ô “Thứ tự hiển thị” — số nhỏ hiện trước.</li>
          <li><strong>Slug:</strong> tự sinh từ tên khi thêm mới. Đổi slug của mục đã đăng sẽ làm hỏng link cũ.</li>
          <li><strong>Trường HTML:</strong> nhập được thẻ như <code>&lt;p&gt;</code>, <code>&lt;h3&gt;</code>, <code>&lt;ul&gt;&lt;li&gt;</code>.</li>
          <li><strong>Nội dung thay đổi hiện ngay</strong> trên website sau khi lưu, không cần build lại.</li>
        </ul>
      </div>
    </>
  )
}
