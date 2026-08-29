import { SectionHeading } from '@/components/ui/section-heading'

const STRENGTHS = [
  {
    title: 'Hồ sơ pháp lý đầy đủ',
    text: 'Chứng chỉ xuất xứ, chứng nhận hệ thống quản lý ISO 9001, ISO 14001, ISO 45001 của nhà sản xuất và kết quả thí nghiệm vật liệu cho từng lô hàng.',
  },
  {
    title: 'Vật tư đạt tiêu chuẩn quốc tế',
    text: 'Sản phẩm được thí nghiệm theo ASTM A370, ASTM D412, ASTM E376, TCVN và tiêu chuẩn riêng của từng dự án.',
  },
  {
    title: 'Thi công và dịch vụ hiện trường',
    text: 'Đội ngũ kỹ thuật trực tiếp lắp đặt, căng kéo và hướng dẫn thi công tại công trường, không chỉ dừng ở khâu cung cấp.',
  },
  {
    title: 'Nguồn cung đa quốc gia',
    text: 'Hợp tác với các nhà sản xuất tại Nhật Bản, Italy và Trung Quốc, chủ động phương án thay thế khi nguồn cung biến động.',
  },
]

/** Four key commitments; static content, not from the API. */
export function StrengthsSection() {
  return (
    <section className="section section--dark">
      <div className="container">
        <SectionHeading
          eyebrow="Cam kết"
          title="Vì sao chủ đầu tư chọn Hòa Hoàng"
          align="center"
          light
        />
        <div className="grid grid--2">
          {STRENGTHS.map((item, index) => (
            <div className="commitment" key={item.title}>
              <span className="commitment__index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p className="mb-0">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
