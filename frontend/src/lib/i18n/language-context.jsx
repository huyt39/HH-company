import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { translations } from './translations'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'hoahoang-lang'

function readStoredLang() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'vi'
  } catch {
    return 'vi'
  }
}

function resolve(dict, path) {
  return path.split('.').reduce((node, key) => node?.[key], dict)
}

/** Public-site language: 'vi' (default) or 'en'. Admin area does not use this. */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Storage unavailable (private mode) — language just won't persist.
    }
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      /** Look up a dot-path key (e.g. "nav.home"); falls back to Vietnamese, then the key itself. */
      t: (key) => resolve(translations[lang], key) ?? resolve(translations.vi, key) ?? key,
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}
