import { useLayoutEffect, useRef, useState } from 'react'

import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Overview: intro text with site photos and the company mark alongside, then the registration
 * details as a flat two-column record below.
 *
 * The facts are the fields a main contractor copies into a bid file, so they
 * read as a register extract — label, value, hairline rule — rather than a
 * boxed sidebar card. Running full width also halves the height: each fact
 * takes one row instead of stacking its label above its value.
 */
// Four sites, four kinds of work: an arch, a cable-stayed span going up, a
// river crossing under construction, and the crew on the deck. `x`/`y` place each photo's centre
// relative to the gallery's centre (in % of its width), `r` tilts it.
const PHOTOS = [
  {
    src: '/images/cau-can-giuoc-thay-he-cap/thay-he-cap-cau-vom-can-giuoc-36f7ce62.jpg',
    alt: 'Thay hệ cáp cầu vòm Cần Giuộc',
    x: -17, y: -24, r: -4, w: 62,
  },
  {
    src: '/images/cau-nhon-trach-vanh-dai-3/cau-nhon-trach-vanh-dai-3-01-f16caf22.jpg',
    alt: 'Cầu Nhơn Trạch, Vành đai 3 TP. Hồ Chí Minh, giai đoạn thi công',
    x: 22, y: -14, r: 5, w: 50,
  },
  {
    src: '/images/cau-song-rang-long-son-cai-mep/thi-cong-cau-song-rang-long-son-cai-mep-7738ab78.jpg',
    alt: 'Thi công cầu Sông Rạng, Long Sơn – Cái Mép',
    x: -20, y: 23, r: 3, w: 52,
  },
  {
    src: '/images/cau-mong-sen-lao-cai/lap-dat-va-cang-keo-cap-cau-mong-sen-95d1d0b0.jpg',
    alt: 'Kỹ sư Hòa Hoàng lắp đặt cáp dự ứng lực trên mặt cầu Móng Sến, Lào Cai',
    x: 19, y: 22, r: -5, w: 56,
  },
]

/**
 * Site photos beside the intro, scattered like prints on a table, with the
 * company mark pinned over them. They start stacked in the middle and fan out
 * one after another the first time the gallery scrolls into view.
 */
function OverviewGallery({ logoAlt, ready }) {
  const ref = useRef(null)
  // Closed only once JS is running, so without it the photos are simply laid out.
  const [state, setState] = useState('static')

  useLayoutEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    setState('closed')
    // Until the intro text arrives the gallery sits at the top of an empty
    // column, already on screen — it would fan out before anyone scrolled to it.
    if (!ready) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setState('open')
        observer.disconnect()
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ready])

  return (
    <div className={`overview__gallery is-${state}`} ref={ref}>
      {PHOTOS.map((photo, index) => (
        <figure
          className="overview__photo"
          key={photo.src}
          style={{
            '--x': `${photo.x}cqw`,
            '--y': `${photo.y}cqw`,
            '--r': `${photo.r}deg`,
            '--w': `${photo.w}%`,
            '--i': index,
          }}
        >
          <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
        </figure>
      ))}
      <span className="overview__badge">
        <img src="/logo-full-alpha.png" alt={logoAlt} width="560" height="656" loading="lazy" decoding="async" />
      </span>
    </div>
  )
}

export function CompanyFacts({ profile }) {
  const { t } = useLang()
  const labels = t('about.factLabels')
  const facts = [
    { label: labels.fullName, value: profile?.name },
    { label: labels.nameEn, value: profile?.name_en },
    { label: labels.shortName, value: profile?.short_name },
    { label: labels.businessCode, value: profile?.tax_code },
    { label: labels.established, value: profile?.established },
    { label: labels.charterCapital, value: profile?.charter_capital },
    { label: labels.mainBusinessLine, value: profile?.main_business_line },
    {
      label: labels.businessLinesCount,
      value: profile?.business_lines_count
        ? t('about.businessLinesCountValue')(profile.business_lines_count)
        : null,
    },
    { label: labels.employeeScale, value: profile?.employees },
    { label: labels.status, value: profile?.status },
  ]

  return (
    <section className="section" id="tong-quan">
      <div className="container">
        <div className="overview">
          <div className="overview__text">
            <SectionHeading eyebrow={t('about.factsEyebrow')} title={t('about.factsTitle')} />
            {profile?.intro?.map((paragraph, index) => (
              <p className="text-muted" key={index}>{paragraph}</p>
            ))}
          </div>
          <OverviewGallery logoAlt={t('about.logoAlt')} ready={Boolean(profile)} />
        </div>

        <div className="company-record">
          <h3 className="company-record__caption">{t('about.recordTitle')}</h3>
          <dl className="company-record__list" data-reveal>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value || t('common.updating')}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
