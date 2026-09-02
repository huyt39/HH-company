import { SectionHeading } from '@/components/ui/section-heading'

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
              <strong>{partner.name}</strong>
              <span className="text-muted">{partner.country}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
