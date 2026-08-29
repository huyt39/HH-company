import { formatVnd } from '@/lib/utils/number-format'

const METRICS = [
  { key: 'revenue', label: 'Doanh thu thuần' },
  { key: 'profit_after_tax', label: 'Lợi nhuận sau thuế' },
  { key: 'total_assets', label: 'Tổng tài sản' },
  { key: 'equity', label: 'Vốn chủ sở hữu' },
]

/** One row per metric, one column per year. */
export function FinancialTable({ years }) {
  return (
    <div className="table-scroll">
      <table className="finance-table">
        <caption className="visually-hidden">
          Chỉ tiêu tài chính theo năm, đơn vị đồng Việt Nam
        </caption>
        <thead>
          <tr>
            <th scope="col">Chỉ tiêu (VNĐ)</th>
            {years.map((year) => <th scope="col" key={year.year}>{year.year}</th>)}
          </tr>
        </thead>
        <tbody>
          {METRICS.map((metric) => (
            <tr key={metric.key}>
              <th scope="row">{metric.label}</th>
              {years.map((year) => (
                <td key={year.year}>{formatVnd(year[metric.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
