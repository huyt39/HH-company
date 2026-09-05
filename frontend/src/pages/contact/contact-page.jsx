import { PageBanner } from '@/components/ui/page-banner'
import { companyApi } from '@/lib/api/company-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import { ContactDetails } from './_components/contact-details'
import { ContactForm } from './_components/contact-form'
import './contact-page.css'

export function ContactPage() {
  const { t } = useLang()
  useDocumentMeta({ title: t('contact.metaTitle'), description: t('contact.metaDesc') })

  const { data: info } = useFetch((options) => companyApi.getContactInfo(options), [])

  return (
    <>
      <PageBanner title={t('nav.contact')} subtitle={t('contact.bannerSubtitle')} />

      <section className="section">
        <div className="container contact-grid">
          <ContactDetails info={info} />
          <ContactForm />
        </div>
      </section>
    </>
  )
}
