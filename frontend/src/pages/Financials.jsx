import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import PageBanner from '../components/ui/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import { EmptyState, ErrorState } from '../components/ui/StateBlock'
import { formatBillion, formatVnd } from '../utils/format'
import './Financials.css'
import { useDocumentMeta } from '../utils/useDocumentMeta'

const METRICS = [
  { key: 'revenue', label: 'Doanh thu thuần' },
  { key: 'profit_after_tax', label: 'Lợi nhuận sau thuế' },
  { key: 'total_assets', label: 'Tổng tài sản' },
  { key: 'equity', label: 'Vốn chủ sở hữu' },
]

export default function Financials() {
  useDocumentMeta({ title: 'Năng lực tài chính', description: 'Số liệu tài chính 3 năm gần nhất của Công ty Hòa Hoàng.' })

  const { data, loading, error } = useFetch((opts) => api.getFinancials(opts), [])
  const { data: profile } = useFetch((opts) => api.getProfile(opts), [])

  const years = data ?? []
  const latest = years[years.length - 1]
  const maxRevenue = Math.max(...years.map((y) => y.revenue), 1)

  return (
    <>
      <PageBanner
        title="Năng lực tài chính"
        subtitle="Số liệu trích từ báo cáo tài chính 3 năm gần nhất theo mẫu B01a/B02 - DNN."
        breadcrumb={[{ label: 'Năng lực tài chính' }]}
      />

      <section className="section">
        <div className="container">
          {error && <ErrorState error={error} />}
          {!loading && !error && years.length === 0 && <EmptyState title="Chưa có số liệu" />}

          {years.length > 0 && (
            <>
              <SectionHeading eyebrow="Tổng quan" title={`Kết quả kinh doanh ${years[0].year} – ${latest.year}`} />

              {/* Biểu đồ cột doanh thu */}
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

              {/* Bảng chỉ tiêu */}
              <div className="table-scroll">
                <table className="finance-table">
                  <caption className="visually-hidden">Chỉ tiêu tài chính theo năm, đơn vị đồng Việt Nam</caption>
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

              <p className="finance-note">
                Đơn vị tiền tệ: đồng Việt Nam. Báo cáo lập theo Thông tư 133/2016/TT-BTC,
                chưa qua kiểm toán độc lập.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading eyebrow="Pháp lý" title="Thông tin doanh nghiệp" />
          <div className="grid grid--3">
            <div className="pillar">
              <h3>Mã số doanh nghiệp</h3>
              <p className="text-muted mb-0">{profile?.tax_code || '—'}</p>
            </div>
            <div className="pillar">
              <h3>Vốn điều lệ</h3>
              <p className="text-muted mb-0">{profile?.charter_capital || '—'}</p>
            </div>
            <div className="pillar">
              <h3>Loại hình</h3>
              <p className="text-muted mb-0">Công ty TNHH hai thành viên trở lên</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
