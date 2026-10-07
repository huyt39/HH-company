import { Link } from 'react-router-dom'

import { ImageTrail } from '@/components/ui/image-trail'
import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

// Small copies (520px) of site and bridge photos, for the cursor trail over
// the photo block. Ordered so neighbours differ: people, structure, detail.
const TRAIL = '/images/trail/'
const TRAIL_IMAGES = [
  'doi-ky-thuat-hoa-hoang-cau-lo-dong-4093bdbf.jpg',
  'he-cap-treo-vom-cau-gioi-phien-7a497461.jpg',
  'cang-keo-cap-du-ung-luc-ngoai-cao-toc-ben-luc-long-thanh-686c4a14.jpg',
  'cau-phu-thinh-lao-cai-ve-dem-cd4de891.jpg',
  'lap-dat-khe-co-gian-rang-luoc-22d899ec.jpg',
  'cau-hoa-binh-2-cap-day-vang-01-7ba6b275.jpg',
  'thay-cap-treo-cau-xom-cui-352afd83.jpg',
  'nut-giao-vanh-dai-3-ha-noi-01-7a8086eb.jpg',
  'cang-keo-cap-cau-nguyen-huu-canh-09654685.jpg',
  'lap-dung-vom-thep-cau-gioi-phien-e1d1dbae.jpg',
  'bo-cap-du-ung-luc-vo-boc-hdpe-tap-ket-cong-truong-e419198c.jpg',
  'thi-cong-cau-song-rang-long-son-cai-mep-7738ab78.jpg',
  'khe-co-gian-cau-may-chai-7bdc05ad.jpg',
  'cau-vuot-ql51-01-ff617c1d.jpg',
  'cang-keo-cap-du-ung-luc-ngoai-cao-toc-ben-luc-long-thanh-cf2c779f.jpg',
  'cau-phu-thinh-lao-cai-01-49db8ed4.jpg',
].map((name) => TRAIL + name)

/** Short company intro on the home page. */
export function AboutIntroSection() {
  const { t } = useLang()

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
        {/* Move the mouse over the photos and more of them drop where it goes. */}
        <ImageTrail images={TRAIL_IMAGES} className="about-intro__trail">
          <div className="about-intro__media" data-reveal-stagger>
            <img
              className="about-intro__photo about-intro__photo--tall"
              src="/images/cong-truong/ky-su-hoa-hoang-tai-cong-truong-6e4c117f.jpg"
              alt="Kỹ sư Hòa Hoàng tại công trường cầu lúc hoàng hôn"
              width="1349"
              height="1600"
              loading="lazy"
              decoding="async"
            />
            <div className="about-intro__stack">
              <img
                className="about-intro__photo"
                src="/images/cong-truong/thiet-bi-cang-keo-du-ung-luc-tai-cong-truong-e86fd45e.jpg"
                alt="Bộ nguồn thủy lực điều khiển căng kéo cáp dự ứng lực tại công trường"
                width="1200"
                height="1600"
                loading="lazy"
                decoding="async"
              />
              <img
                className="about-intro__photo about-intro__photo--wide"
                src="/images/cao-toc-ben-luc-long-thanh-j2/cang-keo-cap-du-ung-luc-ngoai-cao-toc-ben-luc-long-thanh-86211e7f.jpg"
                alt="Giàn thao tác căng kéo cáp dự ứng lực ngoài bên hông dầm cầu cao tốc Bến Lức – Long Thành"
                width="1280"
                height="720"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </ImageTrail>
      </div>
    </section>
  )
}
