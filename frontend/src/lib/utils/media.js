/**
 * Pick the right image URL for the context: lists and cards use the thumbnail,
 * detail pages the full image. The backend only writes a thumbnail when one
 * saves real bytes at a size a card can still crop without stretching, so
 * always fall back to `url` — for a wide panorama that is the sharper choice.
 */
export function thumbUrl(media) {
  return media?.thumb || media?.url || null
}

export function fullUrl(media) {
  return media?.url || null
}
