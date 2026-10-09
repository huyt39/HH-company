import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { Marquee } from '@/components/ui/marquee'
import { SectionHeading } from '@/components/ui/section-heading'
import { StateBlock } from '@/components/ui/state-block'
import { useLang } from '@/lib/i18n/language-context'
import { formatDate } from '@/lib/utils/date-format'

// Below this the strip would loop one or two articles past each other; a plain
// row reads better.
const MIN_TO_RUN = 3

/** Latest articles on the home page: a running strip, like the customer one. */
export function LatestNewsSection({ articles, loading, error }) {
  const { t } = useLang()
  const runs = !loading && !error && articles?.length >= MIN_TO_RUN

  const renderCard = (article) => (
    <Card
      to={`/tin-tuc/${article.slug}`}
      media={article.cover}
      tag={article.category?.name}
      title={article.title}
      meta={formatDate(article.published_at)}
      excerpt={article.excerpt}
    />
  )

  return (
    <section className="section">
      <div className="container">
        <div className="section-head-row">
          <SectionHeading eyebrow={t('home.newsEyebrow')} title={t('home.newsTitle')} />
          <Link to="/tin-tuc" className="btn btn--outline">{t('home.newsViewAll')}</Link>
        </div>
        {!runs && (
          <StateBlock
            loading={loading}
            error={error}
            isEmpty={!articles?.length}
            emptyTitle={t('home.newsEmpty')}
          >
            <div className="grid grid--3" data-reveal-stagger>
              {articles?.map((article) => <Fragment key={article.id}>{renderCard(article)}</Fragment>)}
            </div>
          </StateBlock>
        )}
      </div>

      {/* Edge to edge, like the customer strip. ~11s per card (360px + gap)
          keeps it at the same unhurried pace. */}
      {runs && (
        <div data-reveal>
          <Marquee
            items={articles}
            getKey={(article) => article.id}
            renderItem={renderCard}
            itemWidth="min(360px, 78vw)"
            secondsPerItem={11}
            minItems={6}
            label={t('home.newsTitle')}
          />
        </div>
      )}
    </section>
  )
}
