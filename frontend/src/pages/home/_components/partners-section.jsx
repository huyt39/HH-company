import { SectionHeading } from '@/components/ui/section-heading'
import { thumbUrl } from '@/lib/utils/media'

/** Past customers; hidden entirely when there is no data. */
export function PartnersSection({ partners }) {
  if (!partners?.length) return null

  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading eyebrow="Đối tác" title="Khách hàng đã hợp tác" align="center" />
        <ul className="partner-list">
          {partners.map((partner) => (
            <li className="partner-chip" key={partner.name}>
              {/* Not every partner has a logo, so the name stays the fallback. */}
              {thumbUrl(partner.logo) ? (
                <img
                  className="partner-chip__logo"
                  src={thumbUrl(partner.logo)}
                  alt={partner.logo.alt || partner.name}
                  title={partner.name}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                partner.name
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
