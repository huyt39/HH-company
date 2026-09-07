import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Vision, mission and core values as three labelled statements stacked in rows.
 *
 * Three side-by-side cards forced the vision and mission paragraphs into narrow
 * columns and made the four core values pile up vertically; a label column plus
 * a wide text column gives every statement room to read as a sentence.
 */
export function VisionSection({ profile }) {
  const { t } = useLang()

  return (
    <section className="section section--soft" id="tam-nhin">
      <div className="container">
        <SectionHeading title={t('about.visionTitle')} align="center" />
        <div className="creed">
          <div className="creed__item">
            <h3 className="creed__label">{t('about.visionLabel')}</h3>
            <p className="creed__text">{profile?.vision || `${t('common.updating')}.`}</p>
          </div>
          <div className="creed__item">
            <h3 className="creed__label">{t('about.missionLabel')}</h3>
            <p className="creed__text">{profile?.mission || `${t('common.updating')}.`}</p>
          </div>
          <div className="creed__item">
            <h3 className="creed__label">{t('about.coreValuesLabel')}</h3>
            <ul className="creed__values">
              {profile?.core_values?.map((value) => <li key={value}>{value}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
