import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'
import { thumbUrl } from '@/lib/utils/media'

/** Generic mark for a partner with no logo on file yet. */
function PartnerPlaceholder() {
  return (
    <div className="partner-card__placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path
          fill="currentColor"
          d="M4 21V6l7-3 7 3v15h-4v-5h-6v5H4Zm4-9h2v-2H8v2Zm0 4h2v-2H8v2Zm6-4h2v-2h-2v2Zm0 4h2v-2h-2v2Z"
        />
      </svg>
    </div>
  )
}

/** Past customers; hidden entirely when there is no data. */
export function PartnersSection({ partners }) {
  const { t } = useLang()
  if (!partners?.length) return null

  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading eyebrow={t('home.partnersEyebrow')} title={t('home.partnersTitle')} align="center" />
        <ul className="partner-grid">
          {partners.map((partner) => {
            const logo = thumbUrl(partner.logo)
            return (
              <li className="partner-card" key={partner.name}>
                <div className="partner-card__logo-wrap">
                  {logo ? (
                    <img
                      className="partner-card__logo"
                      src={logo}
                      alt={partner.logo.alt || partner.name}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <PartnerPlaceholder />
                  )}
                </div>
                <span className="partner-card__name">{partner.name}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
