/**
 * First letter of the given name, used as a text avatar.
 *
 * Vietnamese names put the given name last, so the last word is the one a
 * reader would pick out — "Ông Hoàng Khắc Khưu" gives K, not H.
 */
export const initialOf = (fullName) => fullName.trim().split(' ').pop().charAt(0)
