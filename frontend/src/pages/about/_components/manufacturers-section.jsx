import { SectionHeading } from '@/components/ui/section-heading'
import { thumbUrl } from '@/lib/utils/media'

/** Manufacturers whose products the company imports and distributes. */
export function ManufacturersSection({ partners }) {
  if (!partners?.length) return null

  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading
          eyebrow="Nguồn cung"
          title="Nhà sản xuất hợp tác"
          align="center"
        />
        <div className="grid grid--3">
          {partners.map((partner) => (
            <div className="manufacturer" key={partner.name}>
              {thumbUrl(partner.logo) && (
                <img
                  className="manufacturer__logo"
                  src={thumbUrl(partner.logo)}
                  alt={partner.logo.alt || partner.name}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <strong>{partner.name}</strong>
              <span className="text-muted">{partner.country}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
