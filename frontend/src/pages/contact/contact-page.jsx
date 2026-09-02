import { PageBanner } from '@/components/ui/page-banner'
import { companyApi } from '@/lib/api/company-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'

import { ContactDetails } from './_components/contact-details'
import { ContactForm } from './_components/contact-form'
import './contact-page.css'

export function ContactPage() {
  useDocumentMeta({
    title: 'Liên hệ',
    description:
      'Liên hệ Công ty Hòa Hoàng để nhận báo giá cáp dự ứng lực, gối cầu và khe co giãn.',
  })

  const { data: info } = useFetch((options) => companyApi.getContactInfo(options), [])

  return (
    <>
      <PageBanner
        title="Liên hệ"
        subtitle="Gửi yêu cầu báo giá hoặc thông tin dự án, chúng tôi sẽ phản hồi trong thời gian sớm nhất."
      />

      <section className="section">
        <div className="container contact-grid">
          <ContactDetails info={info} />
          <ContactForm />
        </div>
      </section>
    </>
  )
}
