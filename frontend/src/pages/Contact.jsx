import { useState } from 'react'

import { api } from '../api/client'
import { useFetch } from '../api/useFetch'
import PageBanner from '../components/ui/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import './Contact.css'
import { useDocumentMeta } from '../utils/useDocumentMeta'

const emptyForm = { full_name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  useDocumentMeta({ title: 'Liên hệ', description: 'Liên hệ Công ty Hòa Hoàng để nhận báo giá cáp dự ứng lực, gối cầu và khe co giãn.' })

  const { data: info } = useFetch((opts) => api.getContactInfo(opts), [])
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ state: 'sending', message: '' })
    try {
      const res = await api.submitContact({ ...form, phone: form.phone || null, subject: form.subject || null })
      setStatus({ state: 'success', message: res?.message || 'Đã gửi thành công.' })
      setForm(emptyForm)
    } catch (err) {
      setStatus({ state: 'error', message: err.message })
    }
  }

  const details = [
    { label: 'Địa chỉ', value: info?.address },
    { label: 'Điện thoại', value: info?.phone },
    { label: 'Email', value: info?.email },
    { label: 'Mã số thuế', value: info?.tax_code },
  ]

  return (
    <>
      <PageBanner
        title="Liên hệ"
        subtitle="Gửi yêu cầu báo giá hoặc thông tin dự án, chúng tôi sẽ phản hồi trong thời gian sớm nhất."
        breadcrumb={[{ label: 'Liên hệ' }]}
      />

      <section className="section">
        <div className="container contact-grid">
          <div>
            <SectionHeading eyebrow="Thông tin" title="Trụ sở chính" />
            <ul className="contact-info">
              {details.map((item) => (
                <li key={item.label}>
                  <span className="contact-info__label">{item.label}</span>
                  <span className="contact-info__value">{item.value || 'Đang cập nhật'}</span>
                </li>
              ))}
            </ul>

            <div className="contact-map">
              {info?.map_embed_url ? (
                <iframe
                  src={info.map_embed_url}
                  title="Bản đồ trụ sở"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="contact-map__placeholder">Bản đồ đang được cập nhật</div>
              )}
            </div>
          </div>

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

              <button type="submit" className="btn btn--primary" disabled={status.state === 'sending'}>
                {status.state === 'sending' ? 'Đang gửi…' : 'Gửi liên hệ'}
              </button>

              {status.state === 'success' && <p className="form-alert form-alert--ok">{status.message}</p>}
              {status.state === 'error' && <p className="form-alert form-alert--err">{status.message}</p>}
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
