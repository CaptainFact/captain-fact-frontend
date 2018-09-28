import React from 'react'
import { merge, Map } from 'immutable'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import capitalize from 'voca/capitalize'

import { MIN_REPUTATION_ADD_VIDEO, ALL_VIDEOS, ONLY_PARTNERS, ONLY_COMMUNITY } from '../../constants'
import { VideosGrid } from './VideosGrid'
import { LoadingFrame, Icon } from '../Utils'
import { fetchPublicVideos } from '../../state/videos/effects'
import { ErrorView } from '../Utils/ErrorView'
import { reset } from '../../state/videos/reducer'
import { changeVideosLanguageFilter, setVideosOnlyFromPartners } from '../../state/user_preferences/reducer'
import LanguageSelector from '../App/LanguageSelector'
import FilterOnlyFromPartners from './FilterOnlyFromPartners'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'
import PaginationMenu from '../Utils/PaginationMenu'
import FieldWithLabelAddon from '../FormUtils/FieldWithLabelAddon'
import VideosFilterBar from './VideosFilterBar'
import AddVideoBtn from './AddVideoBtn'


@connect(state => ({
  videos: state.Videos.data,
  isLoading: state.Videos.isLoading,
  error: state.Videos.error,
  languageFilter: state.UserPreferences.videosLanguageFilter,
  onlyFromPartners: state.UserPreferences.videosOnlyFromPartners,
}), { fetchPublicVideos, reset, changeVideosLanguageFilter, setVideosOnlyFromPartners })
@translate('main')
export class PublicVideos extends React.PureComponent {
  componentDidMount() {
    this.props.fetchPublicVideos(this.buildFilters())
  }

  componentWillUnmount() {
    this.props.reset()
  }

  componentDidUpdate(oldProps) {
    if (oldProps.languageFilter !== this.props.languageFilter
      || oldProps.onlyFromPartners !== this.props.onlyFromPartners) {
      this.props.fetchPublicVideos(this.buildFilters())
    }
  }

  render() {
    const { t, languageFilter, onlyFromPartners } = this.props

    return (
      <div className="videos-page">
        <section className="header">
          <h2 className="title is-2">
            <Icon name="television" />
            <span> {capitalize(t('entities.video_plural'))}</span>
          </h2>
          <AddVideoBtn />
        </section>
        <VideosFilterBar
          onLanguageChange={(v) => this.onVideosFilterChange(v)}
          onSourceChange={setVideosOnlyFromPartners}
          language={languageFilter}
          source={onlyFromPartners}
        />
        {this.renderContent()}
      </div>
    )
  }

  renderPaginationMenu() {
    return (
      <PaginationMenu
        currentPage={1}
        total={5}
        isRounded
      />
    )
  }

  renderContent() {
    if (this.props.isLoading)
      return <LoadingFrame />
    if (this.props.error)
      return <ErrorView error={this.props.error} />
    if (this.props.videos.size === 0)
      return <h2>{this.props.t('errors:client.noVideoAvailable')}</h2>

    const paginationMenu = this.renderPaginationMenu()
    return (
      <div>
        {paginationMenu}
        <VideosGrid videos={this.props.videos} />
        {paginationMenu}
      </div>
    )
  }

  onVideosFilterChange(value) {
    const language = value === 'all' ? null : value
    this.props.changeVideosLanguageFilter(language)
  }

  buildFilters() {
    const { languageFilter, onlyFromPartners } = this.props

    const partnerFilter = {
      [ALL_VIDEOS]: {},
      [ONLY_PARTNERS]: { is_partner: true },
      [ONLY_COMMUNITY]: { is_partner: false }
    }[onlyFromPartners]

    const languageVideosFilter = languageFilter ? { language: languageFilter } : {}

    return merge({}, partnerFilter, languageVideosFilter)
  }
}
