import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

export function VisionSection({ profile }) {
  const { t } = useLang()

  return (
    <section className="section section--soft" id="tam-nhin">
      <div className="container">
        <SectionHeading title={t('about.visionTitle')} align="center" />
        <div className="grid grid--3">
          <div className="pillar">
            <h3>{t('about.visionLabel')}</h3>
            <p className="text-muted mb-0">{profile?.vision || `${t('common.updating')}.`}</p>
          </div>
          <div className="pillar">
            <h3>{t('about.missionLabel')}</h3>
            <p className="text-muted mb-0">{profile?.mission || `${t('common.updating')}.`}</p>
          </div>
          <div className="pillar">
            <h3>{t('about.coreValuesLabel')}</h3>
            <ul className="value-list mb-0">
              {profile?.core_values?.map((value) => <li key={value}>{value}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
