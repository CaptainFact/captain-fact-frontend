import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { SpeakerPreview } from './SpeakerPreview'
import { fetchSpeaker, fetchWikiDataInfo } from '../../state/speakers/effects'
import { ErrorView } from '../Utils/ErrorView'
import { Icon } from '../Utils/Icon'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { reset } from '../../state/speakers/reducer'
import { reset as resetVideos } from '../../state/videos/reducer'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import PaginatedVideosContainer from '../Videos/PaginatedVideosContainer'


@withRouter
@connect(state => ({
  speaker: state.Speakers.currentSpeaker,
  links: state.Speakers.currentSpeakerLinks,
  speakerLoading: state.Speakers.isLoading,
  wikiLoading: state.Speakers.isLoadingWiki,
  error: state.Speakers.error,
  userLocale: state.UserPreferences.locale
}), { fetchSpeaker, fetchWikiDataInfo, reset, resetVideos })
export class SpeakerPage extends React.PureComponent {
  componentDidMount() {
    this.props.fetchSpeaker(this.props.params.slug_or_id)
  }

  componentDidUpdate(oldProps) {
    const { speakerLoading, speaker: { wikidata_item_id, slug }, userLocale } = this.props

    // Target speaker changed
    if (this.props.params.slug_or_id !== oldProps.params.slug_or_id) {
      this.props.reset()
      this.props.fetchSpeaker(this.props.params.slug_or_id)
      return
    }

    // Speaker loaded, fetch its wikidata infos
    if (this.shouldFetchWikidata(oldProps, wikidata_item_id, userLocale)) {
      this.props.fetchWikiDataInfo(wikidata_item_id, userLocale)
    }

    // Replace id by slug in URL if necessary
    if (!speakerLoading && slug && slug !== this.props.params.slug_or_id) {
      this.props.router.replace(`/s/${slug}`)
    }
  }

  shouldFetchWikidata(oldProps, newWikidataID, newLocale) {
    return newWikidataID && (
      oldProps.speaker.wikidata_item_id !== newWikidataID
      || oldProps.userLocale !== newLocale
    )
  }

  componentWillUnmount() {
    this.props.reset()
  }

  render() {
    if (this.props.error)
      return <ErrorView error={this.props.error} />
    return (
      <div className="speaker-page">
        <Helmet>
          <title>{this.props.speaker.full_name}</title>
        </Helmet>
        <div className="hero is-light is-bold is-primary">
          <div className="hero-body">
            <SpeakerPreview withoutActions speaker={this.props.speaker} />
            <hr />
            <div className="subtitle">{this.renderWikidata()}</div>
          </div>
        </div>
        {this.renderVideos()}
      </div>
    )
  }

  renderWikidata() {
    if (this.props.wikiLoading)
      return '...'
    return this.renderLink(this.props.links.wikipedia, 'Wikipedia')
  }

  renderVideos() {
    if (this.props.videosLoading || !this.props.speaker)
      return <LoadingFrame />

    const currentPage = parseInt(this.props.location.query.page) || 1
    return (
      <PaginatedVideosContainer
        baseURL={this.props.location.pathname}
        currentPage={currentPage}
        speakerID={this.props.speaker.id}
      />
    )
  }

  renderLink(url, siteName) {
    if (!url)
      return null
    return (
      <ExternalLinkNewTab href={url} className="link-with-icon">
        <Icon name="external-link" /> <span>{siteName}</span>
      </ExternalLinkNewTab>
    )
  }
}
