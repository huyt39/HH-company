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
 * A vertical project gallery. The first images sit beside the opening copy;
 * more project images continue below them in normal document flow, so nothing
 * replaces or overlays an image that the reader has already seen.
 */
function OverviewGallery({ logoAlt }) {
  return (
    <div className="overview__gallery">
      {PHOTOS.map((photo, index) => (
        <figure className={`overview__photo overview__photo--${index + 1}`} key={photo.src}>
          <img src={photo.src} alt={photo.alt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
          {index === 0 && (
            <span className="overview__badge">
              <img src="/logo-full-alpha.png" alt={logoAlt} width="560" height="656" loading="lazy" decoding="async" />
            </span>
          )}
          </figure>
      ))}
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
          <OverviewGallery logoAlt={t('about.logoAlt')} />
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
