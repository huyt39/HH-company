import { thumbUrl } from '@/lib/utils/media'

import './partner-grid.css'

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

/**
 * Logo above, full company name below — the card the customers use on the home
 * page and the manufacturers on the about page. `showCountry` adds the country
 * line the manufacturer list carries.
 */
export function PartnerGrid({ partners, showCountry = false }) {
  return (
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
            {showCountry && partner.country && (
              <span className="partner-card__country">{partner.country}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
