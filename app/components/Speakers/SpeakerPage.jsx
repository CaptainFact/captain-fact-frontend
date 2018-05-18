import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { SpeakerPreview } from './SpeakerPreview'
import { fetchSpeaker, fetchWikiDataInfo } from '../../state/speakers/effects'
import { ErrorView } from '../Utils/ErrorView'
import { Icon } from '../Utils/Icon'
import { VideosGrid } from '../Videos/VideosGrid'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { fetchPublicVideos } from '../../state/videos/effects'
import { reset } from '../../state/speakers/reducer'
import { reset as resetVideos } from '../../state/videos/reducer'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'


@connect(state => ({
  speaker: state.Speakers.currentSpeaker,
  links: state.Speakers.currentSpeakerLinks,
  videos: state.Videos.data,
  speakerLoading: state.Speakers.isLoading,
  wikiLoading: state.Speakers.isLoadingWiki,
  videosLoading: state.Videos.isLoading,
  error: state.Speakers.error,
  userLocale: state.UserPreferences.locale
}), {fetchSpeaker, fetchWikiDataInfo, fetchPublicVideos, reset, resetVideos})
export class SpeakerPage extends React.PureComponent {
  componentDidMount() {
    this.props.fetchSpeaker(this.props.params.slug_or_id)
    this.props.fetchPublicVideos({speaker: this.props.params.slug_or_id})
  }

  componentDidUpdate(oldProps) {
    const { speaker: {wikidata_item_id}, userLocale } = this.props

    // Target speaker changed
    if (this.props.params.slug_or_id !== oldProps.params.slug_or_id) {
      this.props.reset()
      this.props.resetVideos()
      this.props.fetchSpeaker(this.props.params.slug_or_id)
      this.props.fetchPublicVideos({speaker: this.props.params.slug_or_id})
    }

    // Speaker loaded, fetch its wikidata infos
    else if (wikidata_item_id && (oldProps.speaker.wikidata_item_id !== wikidata_item_id || oldProps.userLocale !== userLocale))
      this.props.fetchWikiDataInfo(wikidata_item_id, userLocale)
  }

  componentWillUnmount() {
    this.props.reset()
    this.props.resetVideos()
  }

  render() {
    if (this.props.error)
      return <ErrorView error={this.props.error}/>
    return (
      <div className="speaker-page">
        <Helmet>
          <title>{this.props.speaker.full_name}</title>
        </Helmet>
        <div className="hero is-light is-bold is-primary">
          <div className="hero-body">
            <SpeakerPreview withoutActions speaker={this.props.speaker}/>
            <hr/>
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
    return [
      this.renderLink(this.props.links.wikipedia, 'Wikipedia'),
      this.renderLink(this.props.links.wikimedia, 'Wikimedia'),
      this.renderLink(this.props.links.wikiquote, 'Wikiquote'),
      this.renderLink(this.props.links.wikinews, 'Wikinews'),
    ]
  }

  renderVideos() {
    if (this.props.videosLoading)
      return <LoadingFrame/>
    return <VideosGrid videos={this.props.videos}/>
  }

  renderLink(url, siteName) {
    if (!url)
      return null
    return (
      <ExternalLinkNewTab href={url} key={url} className="link-with-icon">
        <Icon name="link"/> <span>{siteName}</span>
      </ExternalLinkNewTab>
    )
  }
}
