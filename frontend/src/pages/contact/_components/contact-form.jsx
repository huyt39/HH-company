import { useState } from 'react'

import { SectionHeading } from '@/components/ui/section-heading'
import { contactApi } from '@/lib/api/contact-client'
import { useAsyncAction } from '@/lib/hooks/use-async-action'
import { useLang } from '@/lib/i18n/language-context'

const EMPTY_FORM = { full_name: '', email: '', phone: '', subject: '', message: '' }

export function ContactForm() {
  const { t } = useLang()
  const labels = t('contact.formLabels')
  const [form, setForm] = useState(EMPTY_FORM)
  const submit = useAsyncAction((payload) => contactApi.submitMessage(payload))

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Optional fields must be null, not an empty string.
    const { ok } = await submit.run({
      ...form,
      phone: form.phone || null,
      subject: form.subject || null,
    })
    if (ok) setForm(EMPTY_FORM)
  }

  return (
    <div>
      <SectionHeading eyebrow={t('contact.formEyebrow')} title={t('contact.formTitle')} />
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="full_name">{labels.fullName}</label>
          <input
            id="full_name" name="full_name" type="text" required minLength={2}
            value={form.full_name} onChange={handleChange}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="email">{labels.email}</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="phone">{labels.phone}</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="subject">{labels.subject}</label>
          <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="message">{labels.message}</label>
          <textarea
            id="message" name="message" rows={6} required minLength={10}
            value={form.message} onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn--primary" disabled={submit.pending}>
          {submit.pending ? t('contact.submitting') : t('contact.submit')}
        </button>

        {submit.succeeded && (
          <p className="form-alert form-alert--ok">{submit.message || t('contact.successFallback')}</p>
        )}
        {submit.failed && <p className="form-alert form-alert--err">{submit.message}</p>}
      </form>
    </div>
  )
}
