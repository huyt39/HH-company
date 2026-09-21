import { useRef, useState } from 'react'

import { uploadsApi } from '@/lib/api/uploads-client'

/**
 * Upload a document file (PDF, Word, Excel, ZIP...) or enter a URL.
 *
 * @param {{value: string, onChange: (url: string, fileInfo?: object) => void,
 *          label: string, hint?: string}} props
 */
export function FilePicker({ value, onChange, label, hint }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const res = await uploadsApi.uploadFile(file)
      // Pass the uploaded URL and metadata to parent
      onChange(res.url, res)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="admin-field">
      <span>{label}</span>
      {value ? (
        <div className="image-picker__current" style={{ minHeight: 'auto', padding: '12px' }}>
          <div className="image-picker__meta" style={{ width: '100%' }}>
            <div style={{ wordBreak: 'break-all', marginBottom: '8px' }}>
              📄 <a href={value} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                {value}
              </a>
            </div>
            <div className="image-picker__buttons">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
              >
                {busy ? 'Đang tải…' : 'Thay file mới'}
              </button>
              <button
                type="button"
                className="is-danger"
                onClick={() => onChange('')}
              >
                Bỏ file
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          className="image-upload"
          style={{ cursor: 'pointer', display: 'block' }}
          onClick={() => inputRef.current?.click()}
        >
          <span>{busy ? 'Đang tải file lên…' : '+ Tải file từ máy (PDF, Word, Excel, ZIP — tối đa 50 MB)'}</span>
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.txt"
        onChange={handleFileChange}
        disabled={busy}
      />

      {error && <p className="admin-alert admin-alert--error">{error}</p>}
      {hint && <small className="admin-field__hint">{hint}</small>}
    </div>
  )
}
