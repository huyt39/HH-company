import { useState } from 'react'

import { SectionHeading } from '@/components/ui/section-heading'
import { contactApi } from '@/lib/api/contact-client'
import { useAsyncAction } from '@/lib/hooks/use-async-action'

const EMPTY_FORM = { full_name: '', email: '', phone: '', subject: '', message: '' }

export function ContactForm() {
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
      <SectionHeading eyebrow="Gửi tin nhắn" title="Form liên hệ" />
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="full_name">Họ và tên *</label>
          <input
            id="full_name" name="full_name" type="text" required minLength={2}
            value={form.full_name} onChange={handleChange}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="phone">Số điện thoại</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="subject">Tiêu đề</label>
          <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="message">Nội dung *</label>
          <textarea
            id="message" name="message" rows={6} required minLength={10}
            value={form.message} onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn--primary" disabled={submit.pending}>
          {submit.pending ? 'Đang gửi…' : 'Gửi liên hệ'}
        </button>

        {submit.succeeded && (
          <p className="form-alert form-alert--ok">{submit.message || 'Đã gửi thành công.'}</p>
        )}
        {submit.failed && <p className="form-alert form-alert--err">{submit.message}</p>}
      </form>
    </div>
  )
}
