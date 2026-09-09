import { useCallback, useEffect, useId, useRef, useState } from 'react'

import './select-menu.css'

/**
 * Dropdown with a list this site can style.
 *
 * A native `<select>` draws its list with the operating system, so nothing in
 * the stylesheet reaches it. This renders the list itself and keeps the
 * keyboard contract a select has: arrows move the highlight, Enter picks,
 * Escape closes, Home/End jump, and typing is not intercepted.
 *
 * @param {{value: string, options: {value: string, label: string}[],
 *          onChange: (value: string) => void, label: string, className?: string}} props
 */
export function SelectMenu({ value, options, onChange, label, className = '' }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))
  const selected = options[selectedIndex]

  const close = useCallback((refocus = false) => {
    setOpen(false)
    if (refocus) buttonRef.current?.focus()
  }, [])

  const choose = useCallback(
    (index) => {
      const option = options[index]
      if (option) onChange(option.value)
      close(true)
    },
    [options, onChange, close],
  )

  // Opening starts from what is selected, not from the top of the list.
  useEffect(() => {
    if (open) setActive(selectedIndex)
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  // Keep the highlighted row in view when the list is long enough to scroll.
  useEffect(() => {
    if (!open) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) setOpen(true)
        else setActive((index) => Math.min(options.length - 1, index + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!open) setOpen(true)
        else setActive((index) => Math.max(0, index - 1))
        break
      case 'Home':
        if (open) { event.preventDefault(); setActive(0) }
        break
      case 'End':
        if (open) { event.preventDefault(); setActive(options.length - 1) }
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (open) choose(active)
        else setOpen(true)
        break
      case 'Escape':
        if (open) { event.preventDefault(); close(true) }
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div className={`select-menu ${className}`.trim()} ref={rootRef}>
      <button
        type="button"
        ref={buttonRef}
        className={`select-menu__button${open ? ' is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((state) => !state)}
        onKeyDown={onKeyDown}
      >
        <span className="select-menu__value">{selected?.label}</span>
        <svg className="select-menu__caret" viewBox="0 0 12 8" aria-hidden="true" focusable="false">
          <path d="M1 1.5 6 6.5l5-5" fill="none" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <ul
          className="select-menu__list"
          id={listId}
          ref={listRef}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={index === selectedIndex}
              className={[
                'select-menu__option',
                index === active ? 'is-active' : '',
                index === selectedIndex ? 'is-selected' : '',
              ].filter(Boolean).join(' ')}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {index === selectedIndex && (
                <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
                  <path d="M2 7.5 5.5 11 12 3.5" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
