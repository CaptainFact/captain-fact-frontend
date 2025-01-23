import { ExternalLink } from 'lucide-react'
import React from 'react'
import Helmet from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { FRONTEND_URL } from '../../config'
import { LOCAL_STORAGE_KEYS } from '../../lib/local_storage'
import { fetchSpeaker, fetchWikiDataInfo } from '../../state/speakers/effects'
import { reset } from '../../state/speakers/reducer'
import { reset as resetVideos } from '../../state/videos/reducer'
import { Span } from '../StyledUtils/Text'
import { Button } from '../ui/button'
import DismissableMessage from '../Utils/DismissableMessage'
import { ErrorView } from '../Utils/ErrorView'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { LoadingFrame } from '../Utils/LoadingFrame'
import PaginatedVideosContainer from '../Videos/PaginatedVideosContainer'
import { SpeakerPreview } from './SpeakerPreview'

@withRouter
@withTranslation('main')
@connect(
  (state) => ({
    speaker: state.Speakers.currentSpeaker,
    links: state.Speakers.currentSpeakerLinks,
    speakerLoading: state.Speakers.isLoading,
    wikiLoading: state.Speakers.isLoadingWiki,
    error: state.Speakers.error,
    userLocale: state.UserPreferences.locale,
  }),
  { fetchSpeaker, fetchWikiDataInfo, reset, resetVideos },
)
export class SpeakerPage extends React.PureComponent {
  componentDidMount() {
    this.props.fetchSpeaker(this.props.match.params.slug_or_id)
  }

  componentDidUpdate(oldProps) {
    const {
      speakerLoading,
      speaker: { wikidata_item_id, slug },
      userLocale,
    } = this.props

    // Target speaker changed
    if (this.props.match.params.slug_or_id !== oldProps.match.params.slug_or_id) {
      this.props.reset()
      this.props.fetchSpeaker(this.props.match.params.slug_or_id)
      return
    }

    // Speaker loaded, fetch its wikidata infos
    if (this.shouldFetchWikidata(oldProps, wikidata_item_id, userLocale)) {
      this.props.fetchWikiDataInfo(wikidata_item_id, userLocale)
    }

    // Replace id by slug in URL if necessary
    if (!speakerLoading && slug && slug !== this.props.match.params.slug_or_id) {
      this.props.history.replace(`/s/${slug}`)
    }
  }

  shouldFetchWikidata(oldProps, newWikidataID, newLocale) {
    return (
      newWikidataID &&
      (oldProps.speaker.wikidata_item_id !== newWikidataID || oldProps.userLocale !== newLocale)
    )
  }

  componentWillUnmount() {
    this.props.reset()
  }

  getCanonicalUrl() {
    // Get slug or ID
    let slugOrId = this.props.match.params.slug_or_id
    if (this.props.speaker) {
      slugOrId = this.props.speaker.slug || this.props.speaker.id
    }

    // Add pagination
    const searchParams = new URLSearchParams(location.search)
    const currentPage = parseInt(searchParams.get('page')) || 1
    const url = new URL(`${FRONTEND_URL}/s/${slugOrId}`)
    if (currentPage > 1) {
      url.searchParams.set('page', currentPage)
    }

    return url.href
  }

  render() {
    const { t } = this.props
    if (this.props.error) {
      return <ErrorView error={this.props.error} />
    }
    const speaker = this.props.speaker
    const title = `${t('speakerpage.title1')} ${speaker.full_name}`
    return (
      <div className="speaker-page">
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={speaker.title} />
          <meta name="twitter:card" content="summary" />
          <link rel="canonical" href={this.getCanonicalUrl()} />
        </Helmet>
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <h1 className="mb-6">
              <Span fontSize={3}>{t('speakerpage.title1')}</Span>{' '}
              <div className="mt-3">
                <SpeakerPreview withoutActions speaker={this.props.speaker} />
              </div>
            </h1>
            <hr className="my-4 border-t border-gray-200" />
            <div className="text-lg text-gray-600">{this.renderWikidata()}</div>
          </div>
        </div>
        <div className="flex justify-center my-6">
          <DismissableMessage
            localStorageDismissKey={LOCAL_STORAGE_KEYS.DISMISS_SPEAKER_INTRODUCTION}
            className="max-w-3xl mx-4"
          >
            <strong className="block mb-2">{t('speakerpage.info1')}</strong>
            <p className="mb-4">
              {t('speakerpage.info2')}{' '}
              <ExternalLinkNewTab href="/" className="text-blue-600 hover:text-blue-800">
                {t('speakerpage.more')}
              </ExternalLinkNewTab>
            </p>
          </DismissableMessage>
        </div>
        <div className="container mx-auto px-4">{this.renderVideos()}</div>
      </div>
    )
  }

  renderWikidata() {
    if (this.props.wikiLoading) {
      return '...'
    }
    return this.renderLink(this.props.links.wikipedia, 'Wikipedia')
  }

  renderVideos() {
    if (this.props.videosLoading || !this.props.speaker) {
      return <LoadingFrame />
    }

    const searchParams = new URLSearchParams(location.search)
    const currentPage = parseInt(searchParams.get('page')) || 1
    return (
      <PaginatedVideosContainer
        baseURL={this.props.location.pathname}
        currentPage={currentPage}
        speakerID={this.props.speaker.id}
      />
    )
  }

  renderLink(url, siteName) {
    if (!url) {
      return null
    }
    return (
      <Button variant="outline">
        <ExternalLinkNewTab href={url} className="flex items-center gap-2">
          <ExternalLink size="1em" /> <span>{siteName}</span>
        </ExternalLinkNewTab>
      </Button>
    )
  }
}
