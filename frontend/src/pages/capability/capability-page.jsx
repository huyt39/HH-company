import { Link } from 'react-router-dom'

import { PageBanner } from '@/components/ui/page-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { EmptyState } from '@/components/ui/state-block'
import { capabilityApi } from '@/lib/api/capability-client'
import { companyApi } from '@/lib/api/company-client'
import { useDocumentMeta } from '@/lib/hooks/use-document-meta'
import { useFetch } from '@/lib/hooks/use-fetch'
import { useLang } from '@/lib/i18n/language-context'

import './capability-page.css'

export function CapabilityPage() {
  const { t, lang } = useLang()
  useDocumentMeta({ title: t('capability.metaTitle'), description: t('capability.metaDesc') })

  const { data: profile } = useFetch((options) => companyApi.getProfile(options), [])
  const { data: equipment } = useFetch((options) => capabilityApi.getEquipment(options), [])
  const { data: certificates } = useFetch((options) => capabilityApi.getCertificates(undefined, options), [])
  const { data: documents } = useFetch((options) => capabilityApi.getDocuments(options), [])

  const stats = profile?.capability_stats ?? []
  const equipmentPhotos = (equipment ?? []).filter((item) => item.image?.url)

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
          <div className="capability-columns">
            <ul className="personnel-list">
              {(profile?.personnel ?? []).map((row) => (
                <li key={row.title}>
                  <span className="personnel-list__role">
                    {row.title}
                    {row.count != null && <b className="personnel-list__count">{row.count}</b>}
                  </span>
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
          {equipment?.length ? (
            <table className="capability-table">
              <thead>
                <tr>
                  <th>{t('capability.equipmentLabels').name}</th>
                  <th>{t('capability.equipmentLabels').quantity}</th>
                  <th>{t('capability.equipmentLabels').spec}</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.name}
                      {item.note && <span className="capability-table__note">{item.note}</span>}
                    </td>
                    <td className="capability-table__qty text-muted">{item.quantity ?? '—'}</td>
                    <td className="text-muted">{item.spec || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title={t('capability.equipmentEmpty')} />
          )}

          {equipmentPhotos.length > 0 && (
            <div className="equipment-figures">
              {equipmentPhotos.map((item) => (
                <figure key={item.id}>
                  <img
                    src={item.image.url}
                    alt={item.image.alt || item.name}
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>{item.image.alt || item.name}</figcaption>
                </figure>
              ))}
            </div>
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
            <div className="certificate-grid">
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
          <ol className="capability-steps">
            {t('capability.qualitySteps').map((step, index) => (
              <li key={step.title}>
                <span className="capability-steps__index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p className="text-muted mb-0">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
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
      <section className="section" id="tai-lieu">
        <div className="container">
          <SectionHeading
            eyebrow={t('capability.documentsEyebrow')}
            title={t('capability.documentsTitle')}
            description={t('capability.documentsDesc')}
          />
          {documents?.length ? (
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
          ) : (
            <div className="capability-request">
              <p>{t('capability.documentsEmptyDesc')}</p>
              <Link to="/lien-he" className="btn btn--primary">
                {t('capability.documentsRequestCta')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
