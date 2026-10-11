import { useEffect, useRef, useState } from 'react'

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
// river crossing under construction, and the crew on the deck.
const PHOTOS = [
  {
    src: '/images/cau-can-giuoc-thay-he-cap/thay-he-cap-cau-vom-can-giuoc-36f7ce62.jpg',
    alt: 'Thay hệ cáp cầu vòm Cần Giuộc',
  },
  {
    src: '/images/cau-nhon-trach-vanh-dai-3/cau-nhon-trach-vanh-dai-3-01-f16caf22.jpg',
    alt: 'Cầu Nhơn Trạch, Vành đai 3 TP. Hồ Chí Minh, giai đoạn thi công',
  },
  {
    src: '/images/cau-song-rang-long-son-cai-mep/thi-cong-cau-song-rang-long-son-cai-mep-7738ab78.jpg',
    alt: 'Thi công cầu Sông Rạng, Long Sơn – Cái Mép',
  },
  {
    src: '/images/cau-tan-de-neo-kich/cau-tan-de-neo-kich-01-b7d6c044.jpg',
    alt: 'Thi công cầu Tân Đệ, neo kích',
  },
  {
    src: '/images/cau-phu-thinh-lao-cai/cau-phu-thinh-lao-cai-ve-dem-cd4de891.jpg',
    alt: 'Cầu Phú Thịnh, Lào Cai về đêm',
  },
  {
    src: '/images/cao-toc-ben-luc-long-thanh-j2/cang-keo-cap-du-ung-luc-ngoai-cao-toc-ben-luc-long-thanh-cdbedc9c.jpg',
    alt: 'Căng kéo cáp dự ứng lực ngoài cao tốc Bến Lức – Long Thành',
  },
  {
    src: '/images/khe-co-gian-cau-may-chai/khe-co-gian-cau-may-chai-d60f3b0f.jpg',
    alt: 'Thi công khe co giãn cầu Mỹ Chai',
  },
]

/**
 * A sticky project stack. The first image is visible at the start of the
 * overview; as the reader moves through the long introduction, the next site
 * photos reveal in order and stop when this overview section ends.
 */
function OverviewGallery({ logoAlt, trackRef }) {
  const galleryRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const track = trackRef.current
        const gallery = galleryRef.current
        if (!track || !gallery) return
        const trackBox = track.getBoundingClientRect()
        const travel = Math.max(track.offsetHeight - gallery.offsetHeight, 1)
        const next = Math.min(1, Math.max(0, (120 - trackBox.top) / travel))
        setProgress(next)
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [trackRef])

  return (
    <div className="overview__gallery" ref={galleryRef} style={{ '--gallery-progress': progress }}>
      {PHOTOS.map((photo, index) => {
        const reveal = index === 0
          ? 1
          : Math.min(1, Math.max(0, (progress - (index - 1) * 0.12) / 0.22))
        return (
          <figure
            className="overview__photo"
            key={photo.src}
            style={{
              '--i': index,
              '--reveal': reveal,
              '--photo-opacity': 0.035 + (reveal * 0.965),
              '--photo-offset': `${((1 - reveal) * 58) + (index * 14)}px`,
              '--photo-scale': 0.94 + (reveal * 0.06),
              '--photo-z': reveal >= 0.99 ? 30 + index : index + 1,
            }}
          >
            <img src={photo.src} alt={photo.alt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
          </figure>
        )
      })}
      <span className="overview__badge">
        <img src="/logo-full-alpha.png" alt={logoAlt} width="560" height="656" loading="lazy" decoding="async" />
      </span>
    </div>
  )
}

export function CompanyFacts({ profile }) {
  const { t } = useLang()
  const overviewRef = useRef(null)
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
        <div className="overview" ref={overviewRef}>
          <div className="overview__text">
            <SectionHeading eyebrow={t('about.factsEyebrow')} title={t('about.factsTitle')} />
            {profile?.intro?.map((paragraph, index) => (
              <p className="text-muted" key={index}>{paragraph}</p>
            ))}
          </div>
          <OverviewGallery logoAlt={t('about.logoAlt')} trackRef={overviewRef} />
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
