import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/** Head-office details and embedded map. */
export function ContactDetails({ info }) {
  const { t } = useLang()
  const labels = t('contact.labels')
  const details = [
    { label: labels.address, value: info?.address },
    { label: labels.phone, value: info?.phone },
    { label: labels.email, value: info?.email },
    { label: labels.taxCode, value: info?.tax_code },
  ]

  const mapUrl =
    info?.map_embed_url ||
    (info?.address
      ? `https://maps.google.com/maps?q=${encodeURIComponent(info.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`
      : null)

  return (
    <div>
      <SectionHeading eyebrow={t('contact.detailsEyebrow')} title={t('contact.detailsTitle')} />
      <ul className="contact-info">
        {details.map((item) => (
          <li key={item.label}>
            <span className="contact-info__label">{item.label}</span>
            <span className="contact-info__value">{item.value || t('common.updating')}</span>
          </li>
        ))}
      </ul>

      <div className="contact-map">
        {mapUrl ? (
          <iframe
            src={mapUrl}
            title={t('contact.mapTitle')}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="contact-map__placeholder">{t('contact.mapPlaceholder')}</div>
        )}
      </div>
    </div>
  )
}
