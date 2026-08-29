import { SectionHeading } from '@/components/ui/section-heading'

/** Head-office details and embedded map. */
export function ContactDetails({ info }) {
  const details = [
    { label: 'Địa chỉ', value: info?.address },
    { label: 'Điện thoại', value: info?.phone },
    { label: 'Email', value: info?.email },
    { label: 'Mã số thuế', value: info?.tax_code },
  ]

  return (
    <div>
      <SectionHeading eyebrow="Thông tin" title="Trụ sở chính" />
      <ul className="contact-info">
        {details.map((item) => (
          <li key={item.label}>
            <span className="contact-info__label">{item.label}</span>
            <span className="contact-info__value">{item.value || 'Đang cập nhật'}</span>
          </li>
        ))}
      </ul>

      <div className="contact-map">
        {info?.map_embed_url ? (
          <iframe
            src={info.map_embed_url}
            title="Bản đồ trụ sở"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="contact-map__placeholder">Bản đồ đang được cập nhật</div>
        )}
      </div>
    </div>
  )
}
