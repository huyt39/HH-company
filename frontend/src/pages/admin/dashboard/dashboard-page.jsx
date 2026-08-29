import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AdminAlert } from '@/components/admin/admin-alert'
import { AdminPageHead } from '@/components/admin/admin-page-head'
import { messagesApi } from '@/lib/api/messages-client'
import { resourcesApi } from '@/lib/api/resources-client'
import { ADMIN_DASHBOARD_CARDS } from '@/lib/constants/admin-navigation'

export function DashboardPage() {
  const [counts, setCounts] = useState({})
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    // Only `total` is needed, so ask for a single record per resource.
    Promise.all(
      ADMIN_DASHBOARD_CARDS.map((card) =>
        resourcesApi
          .list(card.resource, { page_size: 1 })
          .then((data) => [card.resource, data.total])
          .catch(() => [card.resource, null]),
      ),
    ).then((entries) => setCounts(Object.fromEntries(entries)))

    messagesApi.getUnreadCount().then((data) => setUnread(data.count)).catch(() => {})
  }, [])

  return (
    <>
      <AdminPageHead title="Tổng quan" meta="Quản trị nội dung website Hòa Hoàng" />

      {unread > 0 && (
        <AdminAlert tone="info">
          Có <strong>{unread}</strong> tin nhắn liên hệ chưa đọc.{' '}
          <Link to="/admin/messages">Xem hộp thư →</Link>
        </AdminAlert>
      )}

      <div className="stat-cards">
        {ADMIN_DASHBOARD_CARDS.map((card) => (
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
