import { useEffect } from 'react'

const SITE_NAME = 'Hòa Hoàng'
const DEFAULT_TITLE = 'Hòa Hoàng — Cáp dự ứng lực, gối cầu, khe co giãn'
const DEFAULT_DESCRIPTION =
  'Công ty TNHH ĐTXD và DVTM Hòa Hoàng — cung cấp và thi công hệ cáp dự ứng lực, gối cầu, khe co giãn cho công trình hạ tầng giao thông.'

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
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE
    const desc = description || DEFAULT_DESCRIPTION

    document.title = fullTitle
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[property="og:type"]', 'website')
    setMeta('meta[property="og:url"]', window.location.href)
  }, [title, description])
}
