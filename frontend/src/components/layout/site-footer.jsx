import { Link } from 'react-router-dom'

import { FOOTER_LINK_GROUPS } from '@/lib/constants/site-navigation'
import { telHref } from '@/lib/utils/tel-href'
import { useLang } from '@/lib/i18n/language-context'

import './site-footer.css'

/** @param {{contact?: {address?: string, phone?: string, email?: string, tax_code?: string}}} props */
export function SiteFooter({ contact }) {
  const { t } = useLang()

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
          <p className="site-footer__slogan">{t('footer.slogan')}</p>
          <p className="site-footer__desc">{t('footer.desc')}</p>
        </div>

        {FOOTER_LINK_GROUPS.map((group) => (
          <div className="site-footer__col" key={group.titleKey}>
            <h4>{t(`footer.${group.titleKey}`)}</h4>
            <ul>
              {group.links.map((link) => (
                <li key={link.to}><Link to={link.to}>{t(`nav.${link.labelKey}`)}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="site-footer__col">
          <h4>{t('footer.contactInfoCol')}</h4>
          <ul className="site-footer__contact">
            {contact?.address && <li><span>{t('footer.address')}</span> {contact.address}</li>}
            {contact?.phone && (
              <li>
                <span>{t('footer.phone')}</span> <a href={telHref(contact.phone)}>{contact.phone}</a>
              </li>
            )}
            {contact?.email && (
              <li>
                <span>{t('footer.email')}</span> <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            )}
            {contact?.tax_code && <li><span>{t('footer.taxCode')}</span> {contact.tax_code}</li>}
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <span>{t('footer.copyright')(new Date().getFullYear())}</span>
          {contact?.tax_code && <span>{t('footer.taxCode')} {contact.tax_code}</span>}
        </div>
      </div>
    </footer>
  )
}
