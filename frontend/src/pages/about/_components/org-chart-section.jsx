import { Fragment } from 'react'

import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

/**
 * Org chart. Units flagged `spine` are the reporting line everything hangs off
 * — drawn stacked, one above the next. The rest are branches side by side on
 * the row below. A list with no flags at all still renders: the first unit
 * becomes the spine, as it did before the flag existed.
 */
const MAX_PER_ROW = 4

export function OrgChartSection({ orgUnits }) {
  const { t } = useLang()
  const units = orgUnits ?? []
  const flagged = units.filter((unit) => unit.spine)
  const spine = flagged.length ? flagged : units.slice(0, 1)
  const branches = units.filter((unit) => !spine.includes(unit))
  // Split into rows of equal length (8 → 4 + 4, not 5 + 3) so each row
  // straddles the centre line and the spine can run down between columns.
  const rowCount = Math.ceil(branches.length / MAX_PER_ROW)
  const perRow = Math.ceil(branches.length / rowCount)
  const rows = Array.from({ length: rowCount }, (_, i) => branches.slice(i * perRow, (i + 1) * perRow))

  if (!spine.length) return null

  return (
    <section className="section section--soft" id="co-cau">
      <div className="container">
        <SectionHeading eyebrow={t('about.orgChartEyebrow')} title={t('about.orgChartTitle')} align="center" />
        <div className="org-chart">
          {spine.map((unit, index) => (
            // Fragment, not a wrapper: `.org-chart` centres its own children,
            // and a wrapping box would take the connector off the centre line.
            <Fragment key={unit.name}>
              {index > 0 && <div className="org-connector" aria-hidden="true" />}
              <div className="org-node org-node--root">
                <strong>{unit.name}</strong>
                <small>{unit.name_en}</small>
              </div>
            </Fragment>
          ))}
          <div className="org-connector" aria-hidden="true" />
          <div className="org-rows" style={{ '--org-cols': perRow }}>
            {rows.map((row, rowIndex) => (
              <div className="org-row" data-reveal-stagger key={rowIndex}>
                {row.map((unit) => (
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
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
