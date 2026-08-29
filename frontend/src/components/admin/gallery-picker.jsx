import { useState } from 'react'

import { ImagePicker } from './image-picker'

/** Secondary images: add, replace, remove and reorder. */
export function GalleryPicker({ value = [], onChange, label }) {
  const [adding, setAdding] = useState(false)
  const items = value ?? []

  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const setAlt = (index, alt) =>
    onChange(items.map((item, i) => (i === index ? { ...item, alt } : item)))

  return (
    <div className="gallery-picker">
      <span className="image-picker__label">{label}</span>

      {items.length === 0 && <p className="admin-hint">Chưa có ảnh phụ nào.</p>}

      {items.map((item, index) => (
        <div className="gallery-picker__row" key={`${item.url}-${index}`}>
          <img src={item.thumb || item.url} alt={item.alt || ''} />
          <input
            type="text"
            placeholder="Mô tả ảnh"
            value={item.alt ?? ''}
            onChange={(event) => setAlt(index, event.target.value)}
          />
          <div className="gallery-picker__buttons">
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Lên">↑</button>
            <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Xuống">↓</button>
            <button
              type="button"
              className="is-danger"
              aria-label="Xoá"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {adding ? (
        <ImagePicker
          label="Ảnh mới"
          value={null}
          onChange={(media) => {
            if (media) onChange([...items, media])
            setAdding(false)
          }}
        />
      ) : (
        <button type="button" className="btn btn--outline" onClick={() => setAdding(true)}>
          + Thêm ảnh phụ
        </button>
      )}
    </div>
  )
}
