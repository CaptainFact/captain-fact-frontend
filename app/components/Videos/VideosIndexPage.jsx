import React from 'react'
import { merge } from 'immutable'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import capitalize from 'voca/capitalize'

import { ALL_VIDEOS, ONLY_PARTNERS, ONLY_COMMUNITY } from '../../constants'
import { Icon } from '../Utils'
import { changeVideosLanguageFilter, setVideosOnlyFromPartners } from '../../state/user_preferences/reducer'
import VideosFilterBar from './VideosFilterBar'
import AddVideoBtn from './AddVideoBtn'
import PaginatedVideosContainer from './PaginatedVideosContainer'


@connect(state => ({
  languageFilter: state.UserPreferences.videosLanguageFilter,
  onlyFromPartners: state.UserPreferences.videosOnlyFromPartners,
}), { changeVideosLanguageFilter, setVideosOnlyFromPartners })
@withNamespaces('main')
export default class VideosIndexPage extends React.PureComponent {
  render() {
    const { t, languageFilter, onlyFromPartners, setVideosOnlyFromPartners, location } = this.props
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
          onLanguageChange={v => this.onVideosFilterChange(v)}
          onSourceChange={v => setVideosOnlyFromPartners(v)}
          language={languageFilter}
          source={onlyFromPartners}
        />
        <PaginatedVideosContainer
          baseURL={this.props.location.pathname}
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
