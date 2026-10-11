import { CtaBand } from '@/components/ui/cta-band'
import { useLang } from '@/lib/i18n/language-context'

/** Contact call-to-action at the bottom of the home page. */
export function QuoteCtaSection() {
  const { t } = useLang()

  return (
    <CtaBand
      eyebrow={t('home.ctaEyebrow')}
      title={t('home.ctaTitle')}
      description={t('home.ctaDesc')}
      buttonLabel={t('home.ctaButton')}
      image="/images/cong-truong/ky-su-hoa-hoang-tai-cong-truong-6e4c117f.jpg"
    />
  )
}
