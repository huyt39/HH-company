import { SectionHeading } from '@/components/ui/section-heading'

export function VisionSection({ profile }) {
  return (
    <section className="section section--soft" id="tam-nhin">
      <div className="container">
        <SectionHeading title="Tầm nhìn — Sứ mệnh — Giá trị cốt lõi" align="center" />
        <div className="grid grid--3">
          <div className="pillar">
            <h3>Tầm nhìn</h3>
            <p className="text-muted mb-0">{profile?.vision || 'Đang cập nhật.'}</p>
          </div>
          <div className="pillar">
            <h3>Sứ mệnh</h3>
            <p className="text-muted mb-0">{profile?.mission || 'Đang cập nhật.'}</p>
          </div>
          <div className="pillar">
            <h3>Giá trị cốt lõi</h3>
            <ul className="value-list mb-0">
              {profile?.core_values?.map((value) => <li key={value}>{value}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
