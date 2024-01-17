import { Box } from '@rebass/grid'
import React from 'react'
import Helmet from 'react-helmet'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { FRONTEND_URL } from '../../config'
import { LOCAL_STORAGE_KEYS } from '../../lib/local_storage'
import { fetchSpeaker, fetchWikiDataInfo } from '../../state/speakers/effects'
import { reset } from '../../state/speakers/reducer'
import { reset as resetVideos } from '../../state/videos/reducer'
import { Span } from '../StyledUtils/Text'
import DismissableMessage from '../Utils/DismissableMessage'
import { ErrorView } from '../Utils/ErrorView'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { Icon } from '../Utils/Icon'
import { LoadingFrame } from '../Utils/LoadingFrame'
import PaginatedVideosContainer from '../Videos/PaginatedVideosContainer'
import { SpeakerPreview } from './SpeakerPreview'

@withRouter
@withNamespaces('main')
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
        <div className="hero is-light is-bold is-primary">
          <div className="hero-body">
            <h1 className="title">
              <Span fontSize={3}>{t('speakerpage.title1')}</Span>{' '}
              <Box mt={3}>
                <SpeakerPreview withoutActions speaker={this.props.speaker} />
              </Box>
            </h1>
            <hr />
            <div className="subtitle">{this.renderWikidata()}</div>
          </div>
        </div>
        <div className="pagination is-centered videos-pagination">
          <DismissableMessage
            localStorageDismissKey={LOCAL_STORAGE_KEYS.DISMISS_SPEAKER_INTRODUCTION}
          >
            <strong>{t('speakerpage.info1')}</strong>
            <br />
            <br />
            {t('speakerpage.info2')}{' '}
            <ExternalLinkNewTab href="/">{t('speakerpage.more')}</ExternalLinkNewTab>
          </DismissableMessage>
        </div>
        <br />
        {this.renderVideos()}
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
      <ExternalLinkNewTab href={url} className="link-with-icon">
        <Icon name="external-link" /> <span>{siteName}</span>
      </ExternalLinkNewTab>
    )
  }
}
