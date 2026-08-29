/**
 * Pick the right image URL for the context. The backend generates a thumbnail
 * (long edge <= 480px) only for large images, so always fall back to `url`:
 * lists and cards use the thumbnail, detail pages the full image.
 */
export function thumbUrl(media) {
  return media?.thumb || media?.url || null
}

export function fullUrl(media) {
  return media?.url || null
}
