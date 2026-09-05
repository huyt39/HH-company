import { useEffect } from 'react'

import { useLang } from '@/lib/i18n/language-context'

const JSON_LD_ID = 'hoahoang-jsonld'

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

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

/**
 * Organization structured data.
 *
 * `GeneralContractor` rather than the generic `Organization`: search engines
 * read the type, and the whole point of the site is that this is a contractor,
 * not a trading company.
 */
function setJsonLd(description) {
  let script = document.head.querySelector(`script#${JSON_LD_ID}`)
  if (!script) {
    script = document.createElement('script')
    script.id = JSON_LD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: 'Công ty TNHH Đầu tư Xây dựng và Dịch vụ Thương mại Hòa Hoàng',
    alternateName: 'HOA HOANG INTRA CO., LTD',
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    description,
    foundingDate: '2013-10-25',
    taxID: '0106346833',
    telephone: '+842422008708',
    email: 'vnhoahoang@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tầng 23, Tòa nhà MD Complex Tower, Khu đô thị Mỹ Đình 1, Phường Từ Liêm',
      addressLocality: 'Hà Nội',
      addressCountry: 'VN',
    },
    areaServed: { '@type': 'Country', name: 'Việt Nam' },
    knowsAbout: [
      'Thi công căng kéo cáp dự ứng lực ngoài',
      'Lắp dựng hệ cáp cầu vòm, cầu dây văng',
      'Lắp đặt gối cầu',
      'Lắp đặt khe co giãn',
      'Sửa chữa và tăng cường cầu cũ',
    ],
  })
}

/**
 * Set the page title, description, canonical URL and structured data.
 * Hand-rolled instead of pulling in react-helmet — the app renders
 * client-side, so updating the head is enough.
 *
 * @param {{title?: string, description?: string}} [meta]
 */
export function useDocumentMeta({ title, description } = {}) {
  const { t, lang } = useLang()

  useEffect(() => {
    const fullTitle = title ? `${title} — ${t('meta.siteName')}` : t('meta.defaultTitle')
    const desc = description || t('meta.defaultDescription')

    document.title = fullTitle
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[property="og:type"]', 'website')
    setMeta('meta[property="og:url"]', window.location.href)
    setMeta('meta[property="og:locale"]', lang === 'en' ? 'en_US' : 'vi_VN')
    // Query strings and hashes never identify a different page here.
    setCanonical(`${window.location.origin}${window.location.pathname}`)
    setJsonLd(t('meta.defaultDescription'))
  }, [title, description, t, lang])
}
