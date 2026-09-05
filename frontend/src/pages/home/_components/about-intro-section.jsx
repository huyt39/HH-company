import { Link } from 'react-router-dom'

import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

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
          <ul className="check-list">
            {t('home.aboutIntroHighlights').map((item) => <li key={item}>{item}</li>)}
          </ul>
          <Link to="/gioi-thieu" className="btn btn--outline">{t('home.aboutIntroCta')}</Link>
        </div>
        <div className="about-intro__media">
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
      </div>
    </section>
  )
}
