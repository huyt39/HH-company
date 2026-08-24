import { useEffect } from 'react'

const SITE_NAME = 'Hòa Hoàng'
const DEFAULT_DESCRIPTION =
  'Công ty TNHH ĐTXD và DVTM Hòa Hoàng — cung cấp và thi công hệ cáp dự ứng lực, gối cầu, khe co giãn cho công trình hạ tầng giao thông.'

function setMeta(selector, attribute, content) {
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    const [, key, value] = selector.match(/\[(\w+)="(.+)"\]/) || []
    if (key) tag.setAttribute(key, value)
    document.head.appendChild(tag)
  }
  tag.setAttribute(attribute, content)
}

/**
 * Đặt thẻ title và description cho từng trang.
 *
 * Tự viết thay vì thêm react-helmet để không kéo thêm phụ thuộc — trang này
 * render phía client nên chỉ cần cập nhật DOM head là đủ cho việc chia sẻ link.
 *
 * @param {{title?: string, description?: string}} meta
 */
export function useDocumentMeta({ title, description } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Cáp dự ứng lực, gối cầu, khe co giãn`
    const desc = description || DEFAULT_DESCRIPTION

    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:type"]', 'content', 'website')
    setMeta('meta[property="og:url"]', 'content', window.location.href)
  }, [title, description])
}
