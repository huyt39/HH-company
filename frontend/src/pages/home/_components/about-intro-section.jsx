import { Link } from 'react-router-dom'

import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * The photo grid beside the intro: straight panels on a grid. `area`
 * places each one (see `.about-bento` in home-page.css); `caption` is shown on
 * hover.
 */
const BENTO = [
  {
    area: 'eng',
    src: '/images/cong-truong/ky-su-hoa-hoang-tai-cong-truong-6e4c117f.jpg',
    alt: 'Kỹ sư Hòa Hoàng tại công trường cầu lúc hoàng hôn',
    caption: 'Kỹ sư hiện trường Hòa Hoàng',
  },
  {
    area: 'cable',
    src: '/images/cau-hoa-binh-2-cap-day-vang/cau-hoa-binh-2-cap-day-vang-01-7ba6b275.jpg',
    alt: 'Hệ cáp dây văng cầu Hòa Bình 2',
    caption: 'Cầu Hòa Bình 2 · hệ cáp dây văng',
  },
  {
    area: 'plant',
    src: '/images/cong-truong/thiet-bi-cang-keo-du-ung-luc-tai-cong-truong-e86fd45e.jpg',
    alt: 'Bộ nguồn thủy lực điều khiển căng kéo cáp dự ứng lực tại công trường',
    caption: 'Bộ nguồn điều khiển căng kéo',
  },
  {
    area: 'joint',
    src: '/images/thi-cong-khe-co-gian/lap-dat-khe-co-gian-rang-luoc-22d899ec.jpg',
    alt: 'Đội thi công lắp đặt khe co giãn răng lược trên mặt cầu',
    caption: 'Lắp đặt khe co giãn răng lược',
  },
  {
    area: 'deck',
    src: '/images/cao-toc-ben-luc-long-thanh-j2/cang-keo-cap-du-ung-luc-ngoai-cao-toc-ben-luc-long-thanh-86211e7f.jpg',
    alt: 'Giàn thao tác căng kéo cáp dự ứng lực ngoài bên hông dầm cầu cao tốc Bến Lức – Long Thành',
    caption: 'Cao tốc Bến Lức – Long Thành · căng kéo cáp DƯL ngoài',
  },
]

/** Short company intro on the home page. */
export function AboutIntroSection() {
  const { t } = useLang()

  return (
    <section className="section about-intro-section">
      <div className="container about-intro">
        <div>
          <SectionHeading
            eyebrow={t('home.aboutIntroEyebrow')}
            title={t('home.aboutIntroTitle')}
            description={t('home.aboutIntroDesc')}
          />
          <ul className="check-list" data-reveal-stagger>
            {t('home.aboutIntroHighlights').map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="about-intro__actions" data-reveal>
            <Link to="/gioi-thieu" className="btn btn--outline">{t('home.aboutIntroCta')}</Link>
          </div>
        </div>

        {/* Panels go in one after another, rising into place like segments
            set into a span, at a slower beat than the rest of the page so the
            sequence reads; pointing at one brings it forward with its label. */}
        <div className="about-bento">
          <div
            className="about-bento__grid"
            data-reveal-stagger="200"
            data-reveal-sequence
            data-reveal-duration="1100"
          >
            {BENTO.map((photo) => (
              <figure className={`about-bento__cell about-bento__cell--${photo.area}`} key={photo.src}>
                <div className="about-bento__panel">
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                  <figcaption className="about-bento__caption">{photo.caption}</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
