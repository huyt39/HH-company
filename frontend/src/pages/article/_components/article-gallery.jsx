import { thumbUrl } from '@/lib/utils/media'

export function ArticleGallery({ media }) {
  if (!media?.length) return null

  return (
    <section className="article__gallery">
      <h2>Hình ảnh thi công</h2>
      <div className="article__gallery-grid">
        {media.map((item) => (
          <figure key={item.url}>
            <img src={thumbUrl(item)} alt={item.alt || ''} loading="lazy" decoding="async" />
            {item.alt && <figcaption>{item.alt}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  )
}
