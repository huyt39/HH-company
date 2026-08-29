import { useEffect, useRef, useState } from 'react'

import { uploadsApi } from '@/lib/api/uploads-client'

/**
 * Upload a new image or pick one from the library.
 * `value` is { url, thumb, alt } — the backend Media schema.
 *
 * @param {{value: object|null, onChange: (media: object|null) => void,
 *          label: string, hint?: string}} props
 */
export function ImagePicker({ value, onChange, label, hint }) {
  const [open, setOpen] = useState(false)
  const [library, setLibrary] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    uploadsApi.listImages().then(setLibrary).catch((err) => setError(err.message))
  }, [open])

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const uploaded = await uploadsApi.uploadImage(file)
      onChange({ url: uploaded.url, thumb: uploaded.thumb, alt: value?.alt || '' })
      setResult(uploaded)
      setOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="image-picker">
      <span className="image-picker__label">{label}</span>

      {value?.url ? (
        <div className="image-picker__current">
          <img src={value.thumb || value.url} alt={value.alt || ''} />
          <div className="image-picker__meta">
            <input
              type="text"
              placeholder="Mô tả ảnh (alt) — giúp SEO và người dùng đọc màn hình"
              value={value.alt ?? ''}
              onChange={(event) => onChange({ ...value, alt: event.target.value })}
            />
            <div className="image-picker__buttons">
              <button type="button" onClick={() => setOpen(true)}>Đổi ảnh</button>
              <button type="button" className="is-danger" onClick={() => onChange(null)}>Bỏ ảnh</button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="image-picker__empty" onClick={() => setOpen(true)}>
          + Chọn hoặc tải ảnh lên
        </button>
      )}

      {hint && <small className="admin-field__hint">{hint}</small>}

      {result && (
        <small className="admin-field__hint">
          Đã tối ưu: {result.width}×{result.height}px, {Math.round(result.size / 1024)} KB
          {result.saved_percent > 0 && ` (giảm ${result.saved_percent}% so với bản gốc)`}
          {result.thumb && ' · đã tạo bản thu nhỏ'}
        </small>
      )}

      {open && (
        <div className="image-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="image-modal__backdrop"
            aria-label="Đóng"
            onClick={() => setOpen(false)}
          />
          <div className="image-modal__panel">
            <header className="admin-drawer__head">
              <h2>Chọn ảnh</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Đóng">✕</button>
            </header>

            <div className="image-modal__body">
              <label className="image-upload">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFile}
                  disabled={busy}
                />
                <span>
                  {busy
                    ? 'Đang tải lên và tối ưu…'
                    : 'Tải ảnh mới từ máy (JPG, PNG, GIF, WEBP — tối đa 20 MB)'}
                </span>
                <small>Ảnh được tự động thu nhỏ, nén và xoá thông tin EXIF (gồm toạ độ GPS)</small>
              </label>

              {error && <p className="admin-alert admin-alert--error">{error}</p>}

              {library.length === 0 ? (
                <p className="admin-hint">Thư viện chưa có ảnh nào.</p>
              ) : (
                <div className="image-grid">
                  {library.map((item) => (
                    <button
                      type="button"
                      className={`image-grid__item ${value?.url === item.url ? 'is-active' : ''}`}
                      key={item.url}
                      onClick={() => {
                        onChange({ url: item.url, thumb: item.thumb, alt: value?.alt || '' })
                        setOpen(false)
                      }}
                    >
                      <img src={item.thumb || item.url} alt="" loading="lazy" />
                      <span>{item.filename}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
