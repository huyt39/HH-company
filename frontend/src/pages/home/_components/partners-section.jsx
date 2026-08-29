import { SectionHeading } from '@/components/ui/section-heading'

/** Past customers; hidden entirely when there is no data. */
export function PartnersSection({ partners }) {
  if (!partners?.length) return null

  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading eyebrow="Đối tác" title="Khách hàng đã hợp tác" align="center" />
        <ul className="partner-list">
          {partners.map((partner) => (
            <li className="partner-chip" key={partner.name}>{partner.name}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
