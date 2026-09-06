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

/** Certificate blocks, in the order a bid reviewer works through them. */
const CERTIFICATE_GROUPS = ['legal', 'iso', 'product', 'acceptance']

export function CapabilityPage() {
  const { t, lang } = useLang()
  useDocumentMeta({ title: t('capability.metaTitle'), description: t('capability.metaDesc') })

  const { data: profile } = useFetch((options) => companyApi.getProfile(options), [])
  const { data: certificates } = useFetch(
    (options) => capabilityApi.getCertificates(undefined, options),
    [],
  )
  const { data: equipment } = useFetch((options) => capabilityApi.getEquipment(options), [])
  const { data: documents } = useFetch((options) => capabilityApi.getDocuments(options), [])

  const stats = profile?.capability_stats ?? []
  const certificateGroups = CERTIFICATE_GROUPS.map((category) => ({
    category,
    items: (certificates ?? []).filter((item) => item.category === category),
  })).filter((group) => group.items.length)

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

      {/* ---------- Legal standing and certificates ---------- */}
      <section className="section section--soft" id="chung-chi">
        <div className="container">
          <SectionHeading
            eyebrow={t('capability.certificatesEyebrow')}
            title={t('capability.certificatesTitle')}
            description={t('capability.certificatesDesc')}
          />
          {certificateGroups.length === 0 ? (
            <EmptyState
              title={t('capability.certificatesEmpty')}
              description={t('capability.certificatesEmptyDesc')}
            />
          ) : (
            certificateGroups.map((group) => (
              <div className="capability-subgroup" key={group.category}>
                <h3 className="capability-subgroup__title">
                  {t('capability.certificateCategories')[group.category]}
                </h3>
                <div className="grid grid--2">
                  {group.items.map((item) => (
                    <article className="certificate-card" key={item.id}>
                      <h4>{item.name}</h4>
                      <dl>
                        {item.code && (
                          <div>
                            <dt>{t('capability.certificateLabels').code}</dt>
                            <dd className="mono">{item.code}</dd>
                          </div>
                        )}
                        {item.issuer && (
                          <div>
                            <dt>{t('capability.certificateLabels').issuer}</dt>
                            <dd>{item.issuer}</dd>
                          </div>
                        )}
                        {item.issued && (
                          <div>
                            <dt>{t('capability.certificateLabels').issued}</dt>
                            <dd>{item.issued}</dd>
                          </div>
                        )}
                      </dl>
                      {item.note && <p className="text-muted mb-0">{item.note}</p>}
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ---------- Site team ---------- */}
      <section className="section" id="nhan-su">
        <div className="container">
          <SectionHeading
            eyebrow={t('capability.personnelEyebrow')}
            title={t('capability.personnelTitle')}
            description={t('capability.personnelDesc')}
          />
          <div className="capability-columns">
            <ul className="personnel-grid">
              {(profile?.personnel ?? []).map((row) => (
                <li className="personnel-card" key={row.title}>
                  <span className="personnel-card__marker" aria-hidden="true">◆</span>
                  <div>
                    <h3>{row.title}</h3>
                    {row.note && <p className="text-muted mb-0">{row.note}</p>}
                  </div>
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
                  <th>{t('capability.equipmentLabels').spec}</th>
                  <th>{t('capability.equipmentLabels').quantity}</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="text-muted">{item.spec || '—'}</td>
                    <td>
                      {item.quantity ? `${item.quantity} ${item.unit || ''}`.trim() : t('common.updating')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title={t('capability.equipmentEmpty')} />
          )}
        </div>
      </section>

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
          <div className="grid grid--2">
            {t('capability.hseItems').map((item) => (
              <div className="commitment" key={item.title}>
                <h3>{item.title}</h3>
                <p className="mb-0">{item.text}</p>
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
