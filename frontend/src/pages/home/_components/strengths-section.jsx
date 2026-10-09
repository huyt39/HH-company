import { useEffect, useRef, useState } from 'react'

import { DomainIcon } from '@/components/ui/domain-icon'
import { SectionHeading } from '@/components/ui/section-heading'
import { useLang } from '@/lib/i18n/language-context'

// How long each commitment stays open before the next one takes over.
const CYCLE_MS = 6000

/**
 * Four commitments; static content, not from the API. Keyed by position:
 * `home.strengths` is a fixed list of four in every language, and the icon and
 * photo belong to the promise, not to the translated string.
 *
 * Each photo shows the promise being kept on site — the company's own crew at
 * the pumps, its own gantry with the logo on it, harnessed work over the river,
 * the tensioning log being filled in at the jack. All four come from one job
 * (Bến Lức – Long Thành); `cam-ket/` holds copies with the camera date stamp
 * cropped off the foot.
 */
const STRENGTH_MEDIA = [
  {
    icon: 'doi-thi-cong',
    src: '/images/cam-ket/ben-luc-long-thanh-cf2c779f.jpg',
    alt: 'Đội thi công Hòa Hoàng vận hành bộ nguồn căng kéo trên mặt cầu cao tốc Bến Lức – Long Thành',
  },
  {
    icon: 'thiet-bi-so-huu',
    src: '/images/cam-ket/ben-luc-long-thanh-47fa28c0.jpg',
    alt: 'Giàn thao tác treo mang logo Hòa Hoàng trên cầu cao tốc Bến Lức – Long Thành',
  },
  {
    icon: 'an-toan-hse',
    src: '/images/cam-ket/ben-luc-long-thanh-ee5c95a8.jpg',
    alt: 'Công nhân đội mũ, đeo dây an toàn thi công trên giàn treo bên hông dầm cầu',
  },
  {
    icon: 'ho-so-nghiem-thu',
    src: '/images/cam-ket/ben-luc-long-thanh-686c4a14.jpg',
    alt: 'Kỹ sư ghi nhật ký căng kéo cáp dự ứng lực ngay tại kích',
  },
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Why a main contractor picks Hoa Hoang: the four commitments as a list that
 * opens one at a time, beside a photo of that commitment on site. It steps
 * through on its own while in view; pointing at or focusing an item opens it
 * and holds it there.
 *
 * On the lighter of the two dark grounds: the featured projects follow
 * immediately on the darker one, and a single shade would have run the two
 * sections together into one unbroken band.
 */
export function StrengthsSection() {
  const { t } = useLang()
  const strengths = t('home.strengths')
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  // Only step through while someone can see it.
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const autoplay = inView && !held && !prefersReducedMotion()
  useEffect(() => {
    if (!autoplay) return undefined
    const timer = setTimeout(() => setActive((i) => (i + 1) % strengths.length), CYCLE_MS)
    return () => clearTimeout(timer)
  }, [autoplay, active, strengths.length])

  const current = STRENGTH_MEDIA[active]

  return (
    <section
      ref={sectionRef}
      className={`section section--dark section--dark-soft strengths${autoplay ? '' : ' is-held'}`}
      style={{ '--strength-cycle': `${CYCLE_MS}ms` }}
    >
      <div className="container strengths__grid">
        <div className="strengths__head">
          <SectionHeading eyebrow={t('home.strengthsEyebrow')} title={t('home.strengthsTitle')} light />
        </div>

        <ol
          className="strengths__list"
          data-reveal-stagger
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
        >
          {strengths.map((item, index) => {
            const isActive = index === active
            return (
              <li className={`strength${isActive ? ' is-active' : ''}`} key={item.title}>
                <button
                  type="button"
                  className="strength__head"
                  aria-expanded={isActive}
                  aria-controls={`strength-${index}`}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <span className="strength__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="strength__title">{item.title}</span>
                  <span className="strength__icon" aria-hidden="true">
                    <DomainIcon slug={STRENGTH_MEDIA[index].icon} kind="commitment" />
                  </span>
                </button>
                <div className="strength__panel" id={`strength-${index}`}>
                  <div>
                    <p>{item.text}</p>
                  </div>
                </div>
                {/* Restarted by the key each time this item opens. */}
                {isActive && <span className="strength__progress" key={`p-${active}`} aria-hidden="true" />}
              </li>
            )
          })}
        </ol>

        <div className="strengths__stage" data-reveal>
          <div className="strengths__frame">
            {STRENGTH_MEDIA.map((media, index) => (
              <img
                key={media.src}
                className={index === active ? 'is-active' : undefined}
                src={media.src}
                alt={index === active ? media.alt : ''}
                loading="lazy"
                decoding="async"
              />
            ))}
            <span className="strengths__count" aria-hidden="true">
              {String(active + 1).padStart(2, '0')}
              <span> / {String(strengths.length).padStart(2, '0')}</span>
            </span>
            <div className="strengths__caption" key={active} aria-hidden="true">
              <span className="strengths__caption-icon">
                <DomainIcon slug={current.icon} kind="commitment" />
              </span>
              {strengths[active].title}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
