/**
 * `tel:` link for a phone number as typed in /admin — "024 2200 8708" becomes
 * "tel:02422008708". Keeps a leading + for international numbers.
 */
export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`
