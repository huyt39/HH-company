import { Link } from 'react-router-dom'

import { FOOTER_LINK_GROUPS } from '@/lib/constants/site-navigation'

import './site-footer.css'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__col site-footer__col--brand">
          <div className="brand brand--footer">
            <img className="brand__logo" src="/logo.png" alt="" width="44" height="44" />
            <span className="brand__text">
              <strong>HÒA HOÀNG</strong>
              <small>HOA HOANG INTRA CO., LTD</small>
            </span>
          </div>
          <p className="site-footer__desc">
            Cung cấp và thi công hệ cáp dự ứng lực, gối cầu, khe co giãn cho các dự án
            hạ tầng giao thông tại Việt Nam từ năm 2014.
          </p>
        </div>

        {FOOTER_LINK_GROUPS.map((group) => (
          <div className="site-footer__col" key={group.title}>
            <h4>{group.title}</h4>
            <ul>
              {group.links.map((link) => (
                <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="site-footer__col">
          <h4>Thông tin liên hệ</h4>
          <ul className="site-footer__contact">
            <li><span>Địa chỉ:</span> Tầng 23, Tòa nhà MD Complex Tower, KĐT Mỹ Đình 1, Phường Từ Liêm, Hà Nội</li>
            <li><span>Điện thoại:</span> 024 2200 8708</li>
            <li><span>Email:</span> vnhoahoang@gmail.com</li>
            <li><span>Mã số thuế:</span> 0106346833</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <span>© {new Date().getFullYear()} Công ty TNHH ĐTXD và DVTM Hòa Hoàng. Bảo lưu mọi quyền.</span>
          <span>Mã số thuế: 0106346833</span>
        </div>
      </div>
    </footer>
  )
}
