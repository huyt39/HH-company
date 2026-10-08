import { PartnerCard } from './partner-grid'
import './partner-marquee.css'

// Speed is set per card so it stays the same whatever the list length:
// one card (210px + 16px gap) every ~6.5s is about 35px/s — slow enough to
// read a company name as it passes.
const SECONDS_PER_CARD = 6.5

/**
 * Partner cards running sideways in an endless loop — the home page's
 * customer strip. The list is drawn twice and the track slides by exactly one
 * copy, so the loop has no visible seam. Hovering pauses it; with reduced
 * motion it is a plain row the visitor scrolls by hand.
 *
 * @param {{partners: object[]}} props
 */
export function PartnerMarquee({ partners, showCountry = false }) {
  return (
    <div
      className="partner-marquee"
      style={{ '--marquee-duration': `${partners.length * SECONDS_PER_CARD}s` }}
    >
      <div className="partner-marquee__track">
        <ul className="partner-marquee__list">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} showCountry={showCountry} />
          ))}
        </ul>
        {/* The second lap, for the seamless wrap; screen readers hear the list once. */}
        <ul className="partner-marquee__list" aria-hidden="true">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} showCountry={showCountry} />
          ))}
        </ul>
      </div>
    </div>
  )
}
