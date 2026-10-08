import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'
import { useMouseParallax } from '@/lib/hooks/use-mouse-parallax'

/**
 * The photo pile beside the intro, back to front. `depth` is how far a photo
 * follows the mouse (the front ones furthest), `tilt` its resting angle; where
 * each one sits is in home-page.css (`.about-collage__item--<n>`).
 */
const COLLAGE = [
  {
    src: '/images/collage/cau-hoa-binh-2-cap-day-vang-01-7ba6b275.jpg',
    alt: 'Hệ cáp dây văng cầu Hòa Bình 2',
    width: 520,
    height: 390,
    depth: 0.35,
    tilt: -6,
  },
  {
    src: '/images/cong-truong/thiet-bi-cang-keo-du-ung-luc-tai-cong-truong-e86fd45e.jpg',
    alt: 'Bộ nguồn thủy lực điều khiển căng kéo cáp dự ứng lực tại công trường',
    width: 1200,
    height: 1600,
    depth: 0.5,
    tilt: 5,
  },
  {
    src: '/images/cong-truong/ky-su-hoa-hoang-tai-cong-truong-6e4c117f.jpg',
    alt: 'Kỹ sư Hòa Hoàng tại công trường cầu lúc hoàng hôn',
    width: 1349,
    height: 1600,
    depth: 0.7,
    tilt: -2,
  },
  {
    src: '/images/collage/doi-ky-thuat-hoa-hoang-cau-lo-dong-4093bdbf.jpg',
    alt: 'Đội kỹ thuật Hòa Hoàng tại công trường cầu Lò Đúc, Hải Phòng',
    width: 520,
    height: 390,
    depth: 0.9,
    tilt: 4,
  },
  {
    src: '/images/cao-toc-ben-luc-long-thanh-j2/cang-keo-cap-du-ung-luc-ngoai-cao-toc-ben-luc-long-thanh-86211e7f.jpg',
    alt: 'Giàn thao tác căng kéo cáp dự ứng lực ngoài bên hông dầm cầu cao tốc Bến Lức – Long Thành',
    width: 1280,
    height: 720,
    depth: 1,
    tilt: -3,
  },
]

/** Short company intro on the home page. */
export function AboutIntroSection() {
  const { t } = useLang()
  const collageRef = useRef(null)
  useMouseParallax(collageRef)

  return (
    <section className="section">
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

        {/* Hover and the pile drifts the way the mouse goes. The item carries
            the scroll reveal, the frame inside it the mouse movement, so the
            two transforms never fight. */}
        <div className="about-collage" ref={collageRef} data-reveal-stagger>
          {COLLAGE.map((photo, index) => (
            <div className={`about-collage__item about-collage__item--${index + 1}`} key={photo.src}>
              <div
                className="about-collage__frame"
                data-depth={photo.depth}
                data-tilt={photo.tilt}
                style={{ '--tilt': `${photo.tilt}deg` }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
