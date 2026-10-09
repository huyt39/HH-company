import { companyApi } from '@/lib/api/company-client'
import { useFetch } from '@/lib/hooks/use-fetch'

/**
 * Where to send a CV: a mailto to the address in admin → Thông tin liên hệ,
 * subject pre-filled. Falls back to the contact page while it loads or if no
 * address is set, so the button always leads somewhere.
 *
 * @returns {(subject: string) => {href: string, external: boolean}}
 */
export function useApplyLink() {
  const { data } = useFetch((options) => companyApi.getContactInfo(options), [])
  const email = data?.email

  return (subject) =>
    email
      ? { href: `mailto:${email}?subject=${encodeURIComponent(subject)}`, external: true }
      : { href: '/lien-he', external: false }
}
