import { formatBillion } from '@/lib/utils/number-format'

/** Revenue bars per year, scaled against the highest year. */
export function RevenueChart({ years }) {
  const maxRevenue = Math.max(...years.map((year) => year.revenue), 1)

  return (
    <div className="revenue-chart" role="img" aria-label="Biểu đồ doanh thu theo năm">
      {years.map((year) => (
        <div className="revenue-chart__col" key={year.year}>
          <span className="revenue-chart__value">{formatBillion(year.revenue)} tỷ</span>
          <div
            className="revenue-chart__bar"
            style={{ height: `${(year.revenue / maxRevenue) * 100}%` }}
          />
          <span className="revenue-chart__year">{year.year}</span>
        </div>
      ))}
    </div>
  )
}
