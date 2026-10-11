import { Link } from 'react-router-dom'

import { DomainIcon } from '@/components/ui/domain-icon'
import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { EmptyState } from '@/components/ui/state-block'
import { capabilityApi } from '@/lib/api/capability-client'
import { companyApi } from '@/lib/api/company-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import { QualitySteps } from './_components/quality-steps'
import './capability-page.css'

/* The plant list is read by group — a bidder asks "what stressing gear do they
   own", not "what is on row four" — so the records are bucketed by category.
   Groups come out in the order the categories first appear in the list, which
   keeps the running order the admin gives the records; anything with no
   category, or one no longer in the admin list, falls into `khac` rather than
   disappearing off the page. */
const EQUIPMENT_CATEGORIES = ['cang-keo', 'nang-ha', 'do-kiem', 'khac']

// A site photo for a group none of whose records carries one, so every group
// is set the same way: one picture for the group beside its table.
const GROUP_PHOTOS = {
  'cang-keo': {
    url: '/images/cao-toc-ben-luc-long-thanh-j2/cang-keo-cap-du-ung-luc-ngoai-cao-toc-ben-luc-long-thanh-e630ccc7.jpg',
    alt: 'Kỹ thuật viên Hòa Hoàng vận hành kích căng kéo cáp dự ứng lực ngoài, cao tốc Bến Lức – Long Thành',
  },
}

function groupEquipment(items) {
  const buckets = new Map()
  for (const item of items) {
    const key = EQUIPMENT_CATEGORIES.includes(item.category) ? item.category : 'khac'
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(item)
  }
  return [...buckets].map(([key, rows]) => ({
    key,
    items: rows,
    // One photo illustrates the whole group: a picture on one row out of three
    // left the other two looking unfinished.
    photo: rows.find((item) => item.image?.url)?.image ?? GROUP_PHOTOS[key] ?? null,
  }))
}

export function CapabilityPage() {
  const { t, lang } = useLang()
  useDocumentMeta({ title: t('capability.metaTitle'), description: t('capability.metaDesc') })

  const { data: profile } = useFetch((options) => companyApi.getProfile(options), [])
  const { data: equipment } = useFetch((options) => capabilityApi.getEquipment(options), [])
  const { data: certificates } = useFetch((options) => capabilityApi.getCertificates(undefined, options), [])
  const { data: documents } = useFetch((options) => capabilityApi.getDocuments(options), [])

  const stats = profile?.capability_stats ?? []
  const equipmentGroups = groupEquipment(equipment ?? [])

  return (
    <>
      <PageBanner title={t('capability.bannerTitle')} subtitle={t('capability.bannerSubtitle')} />

      {stats.length > 0 && (
        <section className="section capability-stats-section">
          <div className="container capability-stats">
            {stats.map((stat) => (
              <div className="capability-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{lang === 'en' && stat.label_en ? stat.label_en : stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Site team ---------- */}
      <section className="section" id="nhan-su">
        <div className="container">
          <SectionHeading
            eyebrow={t('capability.personnelEyebrow')}
            title={t('capability.personnelTitle')}
            description={t('capability.personnelDesc')}
          />
          <div className="capability-columns" data-reveal-stagger>
            <ul className="personnel-list">
              {(profile?.personnel ?? []).map((row) => (
                <li key={row.title}>
                  <span className="personnel-list__role">{row.title}</span>
                  {row.note && <span className="personnel-list__note">{row.note}</span>}
                </li>
              ))}
            </ul>
            <aside className="capability-aside">
              <h3>{t('capability.orgTitle')}</h3>
              <p className="text-muted">{t('capability.orgDesc')}</p>
              <Link to="/gioi-thieu#co-cau" className="btn btn--outline">
                {t('capability.orgCta')}
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- Equipment ---------- */}
      <section className="section section--soft" id="thiet-bi">
        <div className="container">
          <SectionHeading
            eyebrow={t('capability.equipmentEyebrow')}
            title={t('capability.equipmentTitle')}
            description={t('capability.equipmentDesc')}
          />
          {equipmentGroups.length ? (
            <div className="equipment-groups">
              {equipmentGroups.map((group) => (
                <section className="equipment-group" key={group.key}>
                  {/* The group heading only earns its line when there is more
                      than one group to tell apart. */}
                  {equipmentGroups.length > 1 && (
                    <h3 className="equipment-group__title">
                      <DomainIcon slug={group.key} kind="equipment" />
                      {t('capability.equipmentCategories')[group.key]}
                    </h3>
                  )}
                  <div
                    className={`equipment-group__body${group.photo ? '' : ' equipment-group__body--plain'}`}
                    data-reveal-stagger
                  >
                    {group.photo && (
                      <figure className="equipment-group__photo">
                        <img
                          src={group.photo.url}
                          alt={group.photo.alt || t('capability.equipmentCategories')[group.key]}
                          loading="lazy"
                          decoding="async"
                        />
                      </figure>
                    )}
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th scope="col">{t('capability.equipmentColumns').name}</th>
                          <th scope="col">{t('capability.equipmentColumns').spec}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item) => (
                          <tr key={item.id}>
                            <th scope="row">{item.name}</th>
                            <td>
                              {item.spec}
                              {item.note && <span className="equipment-table__note">{item.note}</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <EmptyState title={t('capability.equipmentEmpty')} />
          )}
        </div>
      </section>

      {/* ---------- Certificates ----------
          The Hạng I capability licence is the strongest single credential in
          the profile, and until now it lived only in the admin area. */}
      {certificates?.length > 0 && (
        <section className="section" id="chung-chi">
          <div className="container">
            <SectionHeading
              eyebrow={t('capability.certificatesEyebrow')}
              title={t('capability.certificatesTitle')}
              description={t('capability.certificatesDesc')}
            />
            <div className="certificate-grid" data-reveal-stagger>
              {certificates.map((item) => (
                <article
                  className={`certificate-card${item.image?.url ? ' certificate-card--framed' : ''}`}
                  key={item.id}
                >
                  {item.image?.url && (
                    <a
                      className="certificate-card__figure"
                      href={item.image.url}
                      target="_blank"
                      rel="noreferrer"
                      title={t('capability.certificateViewOriginal')}
                    >
                      <img
                        src={item.image.thumb || item.image.url}
                        alt={item.image.alt || item.name}
                        width={item.image.width}
                        height={item.image.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  )}
                  <div className="certificate-card__body">
                    <h3>{item.name}</h3>
                    {item.code && <p className="certificate-card__code">{item.code}</p>}
                    {/* Labelled rows rather than four unlabelled paragraphs: who
                        issued it and how long it runs are different questions,
                        and stacked bare they read as one block of text. */}
                    {(item.issuer || item.issued) && (
                      <dl className="certificate-card__meta">
                        {item.issuer && (
                          <>
                            <dt>{t('capability.certificateLabels').issuer}</dt>
                            <dd>{item.issuer}</dd>
                          </>
                        )}
                        {item.issued && (
                          <>
                            {/* A licence runs until a date; a letter of
                                acceptance just has a date it was given. */}
                            <dt>
                              {item.category === 'capability'
                                ? t('capability.certificateLabels').validity
                                : t('capability.certificateLabels').issued}
                            </dt>
                            <dd>{item.issued}</dd>
                          </>
                        )}
                      </dl>
                    )}
                    {item.note && <p className="certificate-card__note">{item.note}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Quality process ---------- */}
      <section className="section" id="quy-trinh">
        <div className="container">
          <SectionHeading
            eyebrow={t('capability.qualityEyebrow')}
            title={t('capability.qualityTitle')}
            description={t('capability.qualityDesc')}
          />
          <QualitySteps steps={t('capability.qualitySteps')} label={t('capability.qualityStepLabel')} />
        </div>
      </section>

      {/* ---------- HSE ---------- */}
      <section className="section section--dark" id="an-toan">
        <div className="container">
          <SectionHeading
            eyebrow={t('capability.hseEyebrow')}
            title={t('capability.hseTitle')}
            description={t('capability.hseDesc')}
            light
          />
          <div className="commitments">
            {t('capability.hseItems').map((item) => (
              <div className="commitment" key={item.title}>
                <div className="commitment__body">
                  <h3>{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Downloads ---------- */}
      {/* Only when /admin has published a file: an empty section with a
          "request the profile" box read as a placeholder, and the contact CTA
          elsewhere on the site already covers that ask. */}
      {documents?.length > 0 && (
        <section className="section" id="tai-lieu">
          <div className="container">
            <SectionHeading
              eyebrow={t('capability.documentsEyebrow')}
              title={t('capability.documentsTitle')}
              description={t('capability.documentsDesc')}
            />
            <div className="grid grid--3">
              {documents.map((doc) => (
                <a
                  className="document-card"
                  href={doc.file_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  key={doc.id}
                >
                  <span className="document-card__icon" aria-hidden="true">⬇</span>
                  <div>
                    <h3>{doc.title}</h3>
                    {doc.description && <p className="text-muted">{doc.description}</p>}
                    <span className="document-card__meta">
                      {[doc.language, doc.size_label].filter(Boolean).join(' · ')}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
