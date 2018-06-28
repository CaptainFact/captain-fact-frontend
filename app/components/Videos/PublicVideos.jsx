import React from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import capitalize from 'voca/capitalize'

import { MIN_REPUTATION_ADD_VIDEO } from '../../constants'
import ReputationGuard from '../Utils/ReputationGuard'
import { VideosGrid } from '../Videos'
import { LoadingFrame, Icon } from '../Utils'
import { fetchPublicVideos } from '../../state/videos/effects'
import { ErrorView } from '../Utils/ErrorView'
import { reset } from '../../state/videos/reducer'
import { changeVideosLanguageFilter, setVideosOnlyFromPartners } from '../../state/user_preferences/reducer'
import LanguageSelector from '../App/LanguageSelector'
import FilterOnlyFromPartners from './FilterOnlyFromPartners'


@connect(state => ({
  videos: state.Videos.data,
  isLoading: state.Videos.isLoading,
  error: state.Videos.error,
  languageFilter: state.UserPreferences.videosLanguageFilter,
  onlyFromPartners: state.UserPreferences.videosOnlyFromPartners,
}), {fetchPublicVideos, reset, changeVideosLanguageFilter, setVideosOnlyFromPartners})
@translate('main')
export class PublicVideos extends React.PureComponent {
  componentDidMount() {
    this.props.fetchPublicVideos(this.buildFilters())
  }

  componentWillUnmount() {
    this.props.reset()
  }

  componentDidUpdate(oldProps) {
    if (oldProps.languageFilter !== this.props.languageFilter ||
        oldProps.onlyFromPartners !== this.props.onlyFromPartners) {
      this.props.fetchPublicVideos(this.buildFilters())
    }
  }

  render() {
    return (
      <div className="videos-page">
        <section className="header">
          <h2 className="title is-2">
            <Icon name="television"/>
            <span> {capitalize(this.props.t('entities.video_plural'))}</span>
          </h2>
          <ReputationGuard
            requiredRep={MIN_REPUTATION_ADD_VIDEO}
            verifyFunc={(user, hasReputation) => hasReputation || user.is_publisher}
          >
            <Link to="/videos/add" className="button is-primary" aria-label={this.props.t('videos.add')}>
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
        <div className="level-left"/>
        <div className="level-right">
          <div className="filter">
            <label htmlFor="select-partners">{this.props.t('menu.source')}:</label>
            <FilterOnlyFromPartners
              value={this.props.onlyFromPartners}
              onChange={this.props.setVideosOnlyFromPartners}
            />
          </div>
          <div className="filter">
            <label htmlFor="select-language">{this.props.t('menu.language')}:</label>
            <LanguageSelector
              additionalOptions={new Map({
                all: this.props.t('misc.all'),
                unknown: this.props.t('misc.unknown')
              })}
              handleChange={(v) => this.onVideosFilterChange(v)}
              value={this.props.languageFilter || 'all'}
            />
          </div>
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

    return <VideosGrid videos={this.props.videos}/>
  }

  onVideosFilterChange(value) {
    const language = value === 'all' ? null : value
    this.props.changeVideosLanguageFilter(language)
  }

  buildFilters() {
    const {languageFilter, onlyFromPartners} = this.props
    const filters = {is_partner: onlyFromPartners}
    if (languageFilter)
      filters.language = languageFilter
    return filters
  }
}
