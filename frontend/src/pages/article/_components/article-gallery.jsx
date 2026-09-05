import { useLang } from '@/lib/i18n/language-context'
import { thumbUrl } from '@/lib/utils/media'

export function ArticleGallery({ media, cover }) {
  const { t } = useLang()
  // The cover is already shown full width above, so a gallery holding nothing
  // else is just the same photo twice.
  const extras = media?.filter((item) => item.url !== cover?.url) ?? []
  if (!media?.length || !extras.length) return null

  // A whole gallery sharing one `alt` means it is a group label, not a caption
  // for each shot — printing it under every tile just repeats the same line.
  const captioned = new Set(media.map((item) => item.alt)).size > 1

  return (
    <section className="article__gallery">
      <h2>{t('article.galleryTitle')}</h2>
      <div className="article__gallery-grid">
        {media.map((item) => (
          <figure key={item.url}>
            <img src={thumbUrl(item)} alt={item.alt || ''} loading="lazy" decoding="async" />
            {captioned && item.alt && <figcaption>{item.alt}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  )
}
