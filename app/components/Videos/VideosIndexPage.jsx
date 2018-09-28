import React from 'react'
import { merge } from 'immutable'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import capitalize from 'voca/capitalize'

import { ALL_VIDEOS, ONLY_PARTNERS, ONLY_COMMUNITY } from '../../constants'
import { VideosGrid } from './VideosGrid'
import { LoadingFrame, Icon } from '../Utils'
import { fetchPublicVideos } from '../../state/videos/effects'
import { ErrorView } from '../Utils/ErrorView'
import { reset } from '../../state/videos/reducer'
import { changeVideosLanguageFilter, setVideosOnlyFromPartners } from '../../state/user_preferences/reducer'
import PaginationMenu from '../Utils/PaginationMenu'
import VideosFilterBar from './VideosFilterBar'
import AddVideoBtn from './AddVideoBtn'
import PaginatedVideosContainer from './PaginatedVideosContainer'


@connect(state => ({
  languageFilter: state.UserPreferences.videosLanguageFilter,
  onlyFromPartners: state.UserPreferences.videosOnlyFromPartners,
}), { changeVideosLanguageFilter, setVideosOnlyFromPartners })
@translate('main')
export default class VideosIndexPage extends React.PureComponent {
  render() {
    const { t, languageFilter, onlyFromPartners, location } = this.props
    const currentPage = parseInt(location.query.page) || 1

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
        <PaginatedVideosContainer
          currentPage={currentPage}
          language={languageFilter}
          source={onlyFromPartners}
        />
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
