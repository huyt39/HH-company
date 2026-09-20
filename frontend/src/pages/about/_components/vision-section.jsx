import { DomainIcon } from '@/components/ui/domain-icon'
import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Vision and mission as two large statements on a dark band, with the core
 * values spread across a row underneath.
 *
 * Three equal columns made the values pile up under a short paragraph and left
 * the other two columns half empty. Splitting the two statements from the list
 * lets each take the width it actually needs.
 *
 * Each statement carries a photograph of the thing it claims — the cable system
 * the vision names, the crew and the joint the mission promises — because the
 * band was four blocks of text on navy and read as a page of boilerplate.
 */
// Keyed by position, the way the home commitments are: the four values are a
// fixed list in the profile and the drawing belongs to the promise, not to the
// wording. A fifth value added later falls back to the shared bridge mark.
const VALUE_ICONS = ['chuan-chat-luong', 'dung-tien-do', 'ho-tro-hien-truong', 'minh-bach-ho-so']

export function VisionSection({ profile }) {
  const { t } = useLang()

  return (
    <section className="section section--dark" id="tam-nhin">
      <div className="container">
        <SectionHeading title={t('about.visionTitle')} align="center" light />
        <div className="creed">
          <div className="creed__statement">
            <div className="creed__media">
              <img
                src="/images/cau-hoa-binh-2-cap-day-vang/cau-hoa-binh-2-cap-day-vang-01-7ba6b275.jpg"
                alt="Hệ cáp dây văng cầu Hòa Bình 2 nhìn dọc theo mặt cầu"
                width="1448"
                height="1086"
                loading="lazy"
                decoding="async"
              />
            </div>
            <span className="creed__label">{t('about.visionLabel')}</span>
            <p className="creed__text">{profile?.vision || `${t('common.updating')}.`}</p>
          </div>
          <div className="creed__statement">
            <div className="creed__media">
              <img
                className="creed__photo--low"
                src="/images/thi-cong-khe-co-gian/lap-dat-khe-co-gian-rang-luoc-22d899ec.jpg"
                alt="Đội thi công lắp đặt khe co giãn răng lược trên mặt cầu"
                width="1200"
                height="1600"
                loading="lazy"
                decoding="async"
              />
            </div>
            <span className="creed__label">{t('about.missionLabel')}</span>
            <p className="creed__text">{profile?.mission || `${t('common.updating')}.`}</p>
          </div>
          <div className="creed__values-block">
            <span className="creed__label">{t('about.coreValuesLabel')}</span>
            <ul className="creed__values">
              {profile?.core_values?.map((value, index) => (
                <li key={value}>
                  <span className="creed__value-mark" aria-hidden="true">
                    <DomainIcon slug={VALUE_ICONS[index]} kind="value" />
                  </span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
