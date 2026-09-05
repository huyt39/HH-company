import { useEffect } from 'react'

import { useLang } from '@/lib/i18n/language-context'

function setMeta(selector, content) {
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    const [, key, value] = selector.match(/\[(\w+)="(.+)"\]/) || []
    if (key) tag.setAttribute(key, value)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/**
 * Set the page title and description. Hand-rolled instead of pulling in
 * react-helmet — the app renders client-side, so updating the head is enough.
 *
 * @param {{title?: string, description?: string}} [meta]
 */
export function useDocumentMeta({ title, description } = {}) {
  const { t } = useLang()

  useEffect(() => {
    const fullTitle = title ? `${title} — ${t('meta.siteName')}` : t('meta.defaultTitle')
    const desc = description || t('meta.defaultDescription')

    document.title = fullTitle
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[property="og:type"]', 'website')
    setMeta('meta[property="og:url"]', window.location.href)
  }, [title, description, t])
}
