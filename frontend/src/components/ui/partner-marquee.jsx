import { Marquee } from './marquee'
import { PartnerCard } from './partner-grid'

/**
 * The home page's customer strip. One card (210px + 20px gap) every ~6.5s is
 * about 35px/s — slow enough to read a company name as it passes.
 *
 * @param {{partners: object[], showCountry?: boolean}} props
 */
export function PartnerMarquee({ partners, showCountry = false }) {
  return (
    <Marquee
      items={partners}
      getKey={(partner) => partner.name}
      renderItem={(partner) => <PartnerCard as="div" partner={partner} showCountry={showCountry} />}
      itemWidth="210px"
      secondsPerItem={6.5}
      minItems={8}
    />
  )
}
