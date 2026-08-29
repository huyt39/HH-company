import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { EmptyState, ErrorState } from '@/components/ui/state-block'
import { companyApi } from '@/lib/api/company-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'

import { FinancialTable } from './_components/financial-table'
import { RevenueChart } from './_components/revenue-chart'
import './financials-page.css'

export function FinancialsPage() {
  useDocumentMeta({
    title: 'Năng lực tài chính',
    description: 'Số liệu tài chính 3 năm gần nhất của Công ty Hòa Hoàng.',
  })

  const { data, loading, error } = useFetch((options) => companyApi.getFinancials(options), [])
  const { data: profile } = useFetch((options) => companyApi.getProfile(options), [])

  const years = data ?? []
  const latest = years[years.length - 1]

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
              <SectionHeading
                eyebrow="Tổng quan"
                title={`Kết quả kinh doanh ${years[0].year} – ${latest.year}`}
              />

              <RevenueChart years={years} />
              <FinancialTable years={years} />

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
