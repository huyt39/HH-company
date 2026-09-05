import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/** Org chart: the first entry in `org_units` is the top level, the rest are its departments. */
export function OrgChartSection({ orgUnits }) {
  const { t } = useLang()
  const [root, ...departments] = orgUnits ?? []

  return (
    <section className="section section--soft" id="co-cau">
      <div className="container">
        <SectionHeading eyebrow={t('about.orgChartEyebrow')} title={t('about.orgChartTitle')} align="center" />
        {root && (
          <div className="org-chart">
            <div className="org-node org-node--root">
              <strong>{root.name}</strong>
              <small>{root.name_en}</small>
            </div>
            <div className="org-connector" aria-hidden="true" />
            <div className="org-row">
              {departments.map((unit) => (
                <div className="org-branch" key={unit.name}>
                  <div className="org-node">
                    <strong>{unit.name}</strong>
                    <small>{unit.name_en}</small>
                  </div>
                  {unit.children?.map((child) => (
                    <div className="org-node org-node--child" key={child}>
                      <strong>{child}</strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
