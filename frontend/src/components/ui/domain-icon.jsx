import './domain-icon.css'

/**
 * Line icons drawn from the real hardware each service or product deals with —
 * a stay-cable fan, a finger joint, an anchor head — because no general-purpose
 * icon set carries bridge components. Keyed by slug so the database keeps no
 * presentation detail; anything unknown falls back to the bridge mark.
 *
 * All art lives on a 32×32 grid, stroked in `currentColor` with no fill, so the
 * icons inherit the tile colour and stay legible down to ~18px.
 */
const SERVICE_ICONS = {
  // Kích căng kéo bó cáp luồn trong dầm.
  'cang-keo-du-ung-luc-ngoai': (
    <>
      <path d="M2 19h10" />
      <rect x="11.5" y="11" width="13" height="16" rx="1.5" />
      <path d="M15.5 11v16M20.5 11v16" />
      <rect x="24.5" y="15" width="4.5" height="8" rx="1" />
      <path d="M19 6h10M26.5 3.2 29.3 6l-2.8 2.8" />
    </>
  ),
  // Tháp cầu dây văng với hệ cáp xoè hai bên.
  'he-cap-cau': (
    <>
      <path d="M16 2v27" />
      <path d="M2 23h28M2 26h28" />
      <path d="M16 5 8 23M16 9.5 11.5 23M16 14 14.5 23" />
      <path d="M16 5 24 23M16 9.5 20.5 23M16 14 17.5 23" />
    </>
  ),
  // Dầm — gối cao su bản thép nhiều lớp — bệ trụ.
  'lap-dat-goi-cau': (
    <>
      <rect x="2.5" y="3.5" width="27" height="5" rx="1" />
      <rect x="10" y="12" width="12" height="8" rx="1" />
      <path d="M10 14.7h12M10 17.3h12" />
      <path d="M7.5 23.5h17v6h-17z" />
    </>
  ),
  // Hai bản mặt cầu với răng lược đan vào nhau.
  'lap-dat-khe-co-gian': (
    <>
      <path d="M2 5h10v22H2" />
      <path d="M30 5H20v22h10" />
      <path d="m12 5 8 3.7-8 3.6 8 3.7-8 3.6 8 3.7-8 3.7" />
    </>
  ),
  // Thanh neo xiên vào mái dốc, có bản đệm trên bề mặt.
  'neo-dat-mai-doc': (
    <>
      <path d="M2 29 20 8h9v21z" />
      <path d="m9.2 20.6 6.1 5.2M7.3 22.9l3.9-4.6" />
      <path d="m14.2 14.7 6.1 5.2M12.3 17l3.9-4.6" />
    </>
  ),
  // Cáp cũ (nét đứt) đổi sang cáp mới, mũi tên hoán đổi.
  'thay-the-he-cap': (
    <>
      <path d="M6 27 11.5 5" strokeDasharray="3 3" />
      <path d="M9 4.4h5M3.6 27.6h5" />
      <path d="M21 27 26.5 5" />
      <path d="M24 4.4h5M18.6 27.6h5" />
      <path d="M13 16h7.5M18 13.6l2.6 2.4-2.6 2.4" />
    </>
  ),
  // Cáp dự ứng lực ngoài luồn dưới bụng dầm qua hai ụ chuyển hướng.
  'tang-cuong-cau-cu': (
    <>
      <rect x="2.5" y="4" width="27" height="11" rx="1" />
      <path d="M6.5 21h19" />
      <path d="M6.5 17.5v7M25.5 17.5v7" />
      <path d="M2 21h4.5M4.6 19.1 2.4 21l2.2 1.9" />
      <path d="M30 21h-4.5M27.4 19.1 29.6 21l-2.2 1.9" />
    </>
  ),
  // Khe co giãn cùng cờ lê — sửa chữa, thay thế.
  'thay-the-khe-co-gian': (
    <>
      <path d="M2.5 3h7v16h-7" />
      <path d="M22.5 3h-7v16h7" />
      <path d="m9.5 3 6 4-6 4 6 4-6 4" />
      <path d="M25 19.5 29.3 22v5L25 29.5 20.7 27v-5z" />
      <circle cx="25" cy="24.5" r="2" />
    </>
  ),
  // Hai kích nâng dầm lên để rút gối cũ ra.
  'thay-the-goi-cau': (
    <>
      <rect x="2.5" y="3.5" width="27" height="5" rx="1" />
      <path d="M7.5 24V12M4.5 15l3-3 3 3" />
      <path d="M24.5 24V12M21.5 15l3-3 3 3" />
      <rect x="13" y="15" width="6" height="7" rx="1" />
      <path d="M2.5 27.5h27" />
    </>
  ),
  // Trụ cầu quây phao nổi, mặt nước phía dưới.
  'chong-va-tru-cau': (
    <>
      <rect x="11.5" y="2.5" width="9" height="19.5" rx="1" />
      <circle cx="7" cy="18.5" r="3.4" />
      <circle cx="25" cy="18.5" r="3.4" />
      <path d="M2.5 25c2-1.8 4-1.8 6 0s4 1.8 6 0 4-1.8 6 0 4 1.8 6 0" />
      <path d="M2.5 29c2-1.8 4-1.8 6 0s4 1.8 6 0 4-1.8 6 0 4 1.8 6 0" />
    </>
  ),
  // Đường ray chạy vào vòm hầm.
  'chuyen-giao-cong-nghe-duong-sat-toc-do-cao': (
    <>
      <path d="M3 28.5V16a13 13 0 0 1 26 0v12.5" />
      <path d="M9 28.5 13.4 17.5M23 28.5 18.6 17.5" />
      <path d="M10.2 25.5h11.6M11.5 22h9M12.6 19h6.8" />
    </>
  ),
  // Kiện vật tư xếp trên pallet.
  'cung-cap-vat-tu-thiet-bi': (
    <>
      <rect x="2" y="8" width="15" height="13" rx="1.2" />
      <path d="M17 12h5.5l4.5 4.5V21H17z" />
      <path d="M2 21h3.5M11 21h5.5M22 21h3.5M27 21h1.5" />
      <circle cx="8.2" cy="23.8" r="2.8" />
      <circle cx="24" cy="23.8" r="2.8" />
    </>
  ),
  // Mũ bảo hộ — kỹ thuật hiện trường.
  'dich-vu-ky-thuat-hien-truong': (
    <>
      <path d="M2.5 23.5c0-1.4 1.6-2.2 3.5-2.2h20c1.9 0 3.5.8 3.5 2.2" />
      <path d="M2.5 23.5h27" />
      <path d="M7.5 21.3v-4.6a8.5 8.5 0 0 1 17 0v4.6" />
      <path d="M12.3 21.3c0-6.5 1.3-9.8 3.7-10.4M19.7 21.3c0-6.5-1.3-9.8-3.7-10.4" />
    </>
  ),

}

/** Sản phẩm & công nghệ — tách riêng vì vài slug trùng với bên dịch vụ. */
const PRODUCT_ICONS = {
  // Mặt cắt bó cáp PWS: các sợi song song trong hai lớp vỏ.
  'cap-thanh-pham-cau-day-vang': (
    <>
      <circle cx="16" cy="16" r="12.5" />
      <circle cx="16" cy="16" r="9.5" />
      <circle cx="16" cy="16" r="2.6" />
      <circle cx="21.2" cy="16" r="2.6" />
      <circle cx="10.8" cy="16" r="2.6" />
      <circle cx="18.6" cy="11.5" r="2.6" />
      <circle cx="13.4" cy="11.5" r="2.6" />
      <circle cx="18.6" cy="20.5" r="2.6" />
      <circle cx="13.4" cy="20.5" r="2.6" />
    </>
  ),
  // Cáp bọc epoxy trong vỏ HDPE, cắt lớp nhìn thấy từng tao.
  'cap-epoxy-hdpe': (
    <>
      <rect x="2.5" y="9.5" width="27" height="13" rx="6.5" />
      <rect x="6.5" y="13" width="19" height="6" rx="3" />
      <circle cx="11" cy="16" r="1.6" />
      <circle cx="16" cy="16" r="1.6" />
      <circle cx="21" cy="16" r="1.6" />
    </>
  ),
  // Tao cáp 7 sợi bện xoắn.
  'cap-du-ung-luc': (
    <>
      <path d="M2 16h28" />
      <path d="M2.5 16c3-6.5 6-6.5 9 0s6 6.5 9 0 6-6.5 9 0" />
      <path d="M2.5 16c3 6.5 6 6.5 9 0s6-6.5 9 0 6 6.5 9 0" />
    </>
  ),
  // Đầu neo: bản đệm vuông, lõi neo và các lỗ nêm.
  'neo-du-ung-luc': (
    <>
      <rect x="3.5" y="3.5" width="25" height="25" rx="1.5" />
      <circle cx="16" cy="16" r="8.5" />
      <circle cx="16" cy="16" r="1.9" />
      <circle cx="16" cy="10.6" r="1.9" />
      <circle cx="16" cy="21.4" r="1.9" />
      <circle cx="20.7" cy="13.3" r="1.9" />
      <circle cx="11.3" cy="13.3" r="1.9" />
      <circle cx="20.7" cy="18.7" r="1.9" />
      <circle cx="11.3" cy="18.7" r="1.9" />
    </>
  ),
  // Gối cầu: bản trên, các lớp cao su — bản thép, bản dưới.
  'goi-cau': (
    <>
      <rect x="3.5" y="4.5" width="25" height="4.5" rx="1" />
      <rect x="7" y="12" width="18" height="9" rx="1" />
      <path d="M7 15h18M7 18h18" />
      <rect x="3.5" y="24" width="25" height="4.5" rx="1" />
    </>
  ),
  // Khe co giãn răng lược.
  'khe-co-gian': (
    <>
      <path d="M2 5h10v22H2" />
      <path d="M30 5H20v22h10" />
      <path d="m12 5 8 3.7-8 3.6 8 3.7-8 3.6 8 3.7-8 3.7" />
    </>
  ),
  // Kích thuỷ lực và bơm.
  'thiet-bi-cang-keo': (
    <>
      <rect x="2.5" y="7" width="14" height="12" rx="1.5" />
      <path d="M7 7v12M12 7v12" />
      <path d="M16.5 13h6.5" />
      <path d="M23 9.5v7" />
      <path d="M9.5 19v5h7" />
      <rect x="16.5" y="21.5" width="12" height="7.5" rx="1.2" />
    </>
  ),
  // Thanh neo với bản đệm và ê cu.
  'neo-dat-mai-doc': (
    <>
      <path d="M2 16h17" />
      <path d="M5 13v6M9 13v6M13 13v6" />
      <rect x="18.5" y="7" width="3" height="18" rx="0.6" />
      <path d="M26 11.5 30 13.75v4.5L26 20.5l-4-2.25v-4.5z" />
      <circle cx="26" cy="16" r="1.8" />
    </>
  ),
  // Mặt cắt ray đặt trên tà vẹt.
  'thiet-bi-duong-sat': (
    <>
      <rect x="2.5" y="23" width="27" height="5.5" rx="1" />
      <path d="M10.5 5h11v4h-4v9h5.5v4H9v-4h5.5V9h-4z" />
      <path d="M9 20h-3M23 20h3" />
    </>
  ),
  // Đầu cắt máy khoan hầm TBM.
  'thiet-bi-duong-sat-cao-toc': (
    <>
      <circle cx="16" cy="16" r="13" />
      <circle cx="16" cy="16" r="3.8" />
      <path d="M16 3v9.2M16 19.8V29M3 16h9.2M19.8 16H29" />
      <circle cx="8.9" cy="8.9" r="2.1" />
      <circle cx="23.1" cy="8.9" r="2.1" />
      <circle cx="8.9" cy="23.1" r="2.1" />
      <circle cx="23.1" cy="23.1" r="2.1" />
    </>
  ),
}

/** Nhịp cầu vòm — dấu chung khi chưa có hình riêng cho hạng mục. */
const FALLBACK = (
  <>
    <path d="M2.5 25h27" />
    <path d="M5.5 25a10.5 10.5 0 0 1 21 0" />
    <path d="M16 14.5V25M10 18.5V25M22 18.5V25" />
  </>
)

export function DomainIcon({ slug, kind = 'service', className = '' }) {
  return (
    <svg
      className={`domain-icon ${className}`.trim()}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {(kind === 'product' ? PRODUCT_ICONS : SERVICE_ICONS)[slug] ?? FALLBACK}
    </svg>
  )
}
