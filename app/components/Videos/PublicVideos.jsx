import React from "react"
import { Map } from 'immutable'
import { connect } from "react-redux"
import { Link } from "react-router"
import { translate } from 'react-i18next'
import { MIN_REPUTATION_ADD_VIDEO } from '../../constants'
import { hasReputation } from '../../state/users/current_user/selectors'
import ReputationGuard from '../Utils/ReputationGuard'

import { VideosGrid } from "../Videos"
import { LoadingFrame, Icon } from "../Utils"
import { fetchPublicVideos } from '../../state/videos/effects'
import { ErrorView } from '../Utils/ErrorView'
import { reset } from '../../state/videos/reducer'
import { changeVideosLanguageFilter, changeVideosPublisherFilter } from '../../state/user_preferences/reducer'

import LanguageSelector from '../App/LanguageSelector'
import VideoSelector from '../App/VideoSelector'
import capitalize from 'voca/capitalize'


@connect(state => ({
  videos: state.Videos.data,
  isLoading: state.Videos.isLoading,
  error: state.Videos.error,
  languageFilter: state.UserPreferences.videosLanguageFilter,
  publisherFilter: state.UserPreferences.videosPublisherFilter
}), {fetchPublicVideos, reset, changeVideosLanguageFilter, changeVideosPublisherFilter})
@translate('main')
export class PublicVideos extends React.PureComponent {
  componentDidMount() {
    this.props.fetchPublicVideos(this.props.languageFilter && this.props.publisherFilter && 
      {language: this.props.languageFilter, publisher: this.props.publisherFilter})
  }

  componentWillUnmount() {
    this.props.reset()
  }

  render() {
    return (
      <div className="videos-page">
        <section className="header">
          <h2 className="title is-2">
            <Icon name="television"/>
            <span> {capitalize(this.props.t('entities.video_plural'))}</span>
          </h2>
          <ReputationGuard requiredRep={MIN_REPUTATION_ADD_VIDEO}
                           verifyFunc={(user, hasReputation) => hasReputation || user.is_publisher}>
            <Link to="/videos/add" className="button is-primary">
              <Icon name="plus-circle"/>
              <span>{this.props.t('videos.add')}</span>
            </Link>
          </ReputationGuard>
        </section>
        {this.renderFilterBar()}
        {this.renderContent()}
      </div>
    )
  }

  renderFilterBar() {
    return (
      <nav className="level videos-filter">
        <div className="level-left">
          <span>Publisher:&nbsp;&nbsp;</span>
          <VideoSelector additionalOptions={new Map({
                              all: this.props.t('misc.all'),
                            })}
                            handleChange={this.onVideosFilterChange.bind(this, 'publisher')}
                            value={this.props.publisherFilter || "all"}
          />
        </div>
        <div className="level-right">
          <span>Language:&nbsp;&nbsp;</span>
          <LanguageSelector additionalOptions={new Map({
                              all: this.props.t('misc.all'),
                              unknown: this.props.t('misc.unknown')
                            })}
                            handleChange={this.onVideosFilterChange.bind(this, 'language')}
                            value={this.props.languageFilter || "all"}
          />
        </div>
      </nav>
    )
  }

  renderContent() {
    if (this.props.isLoading)
      return <LoadingFrame />
    else if (this.props.error)
      return <ErrorView error={this.props.error}/>
    else if (this.props.videos.size === 0)
      return <h2>{this.props.t('errors:client.noVideoAvailable')}</h2>
    else
      return <VideosGrid videos={this.props.videos}/>
  }

  onVideosFilterChange(filterType, value) {
    const filter = value === 'all' ? null : value
    if(filterType === 'language') {
      this.props.changeVideosLanguageFilter(filter)
    } else if (filterType === 'publisher') {
      this.props.changeVideosPublisherFilter(filter)
    }
    //this.props.fetchPublicVideos({language: this.props.languageFilter, publisher: this.props.publisherFilter})
    this.props.fetchPublicVideos(this.props.languageFilter && this.props.publisherFilter && 
      {language: this.props.languageFilter, publisher: this.props.publisherFilter})
  }
}
