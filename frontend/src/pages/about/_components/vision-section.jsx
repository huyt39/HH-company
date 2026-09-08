import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Vision and mission as two large statements on a dark band, with the core
 * values spread across a row underneath.
 *
 * Three equal columns made the values pile up under a short paragraph and left
 * the other two columns half empty. Splitting the two statements from the list
 * lets each take the width it actually needs.
 */
export function VisionSection({ profile }) {
  const { t } = useLang()

  return (
    <section className="section section--dark" id="tam-nhin">
      <div className="container">
        <SectionHeading title={t('about.visionTitle')} align="center" light />
        <div className="creed">
          <div className="creed__statement">
            <span className="creed__label">{t('about.visionLabel')}</span>
            <p className="creed__text">{profile?.vision || `${t('common.updating')}.`}</p>
          </div>
          <div className="creed__statement">
            <span className="creed__label">{t('about.missionLabel')}</span>
            <p className="creed__text">{profile?.mission || `${t('common.updating')}.`}</p>
          </div>
          <div className="creed__values-block">
            <span className="creed__label">{t('about.coreValuesLabel')}</span>
            <ul className="creed__values">
              {profile?.core_values?.map((value) => <li key={value}>{value}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
