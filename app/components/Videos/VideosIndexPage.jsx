import React from 'react'
import { merge } from 'immutable'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import capitalize from 'voca/capitalize'
import { Helmet } from 'react-helmet'

import { toAbsoluteURL } from '../../lib/cf_routes'
import { ALL_VIDEOS, ONLY_PARTNERS, ONLY_COMMUNITY, ONLY_FEATURED } from '../../constants'
import { Icon } from '../Utils'
import {
  changeVideosLanguageFilter,
  setVideosFilter,
} from '../../state/user_preferences/reducer'
import VideosFilterBar from './VideosFilterBar'
import AddVideoBtn from './AddVideoBtn'
import PaginatedVideosContainer from './PaginatedVideosContainer'

@connect(
  (state) => ({
    languageFilter: state.UserPreferences.videosLanguageFilter,
    videosFilter: state.UserPreferences.videosFilter,
  }),
  { changeVideosLanguageFilter, setVideosFilter }
)
@withNamespaces('main')
export default class VideosIndexPage extends React.PureComponent {
  render() {
    const { t, languageFilter, videosFilter, setVideosFilter, location } = this.props
    const currentPage = parseInt(location.query.page) || 1

    return (
      <div className="videos-page">
        <Helmet>
          <meta property="og:url" content={toAbsoluteURL('/videos')} />
          <meta
            property="og:title"
            content="Les vidéos sourcées et vérifiées sur CaptainFact"
          />
          <meta
            property="og:description"
            content="Découvrez diverses vidéos sourcées et vérifiées par la communauté CaptainFact"
          />
        </Helmet>
        <section className="header">
          <h2 className="title is-2">
            <Icon name="television" />
            <span> {capitalize(t('entities.video_plural'))}</span>
          </h2>
          <AddVideoBtn />
        </section>
        <VideosFilterBar
          onLanguageChange={(v) => this.onVideosLanguageChange(v)}
          onSourceChange={(v) => setVideosFilter(v)}
          language={languageFilter}
          source={videosFilter}
        />
        <PaginatedVideosContainer
          baseURL={this.props.location.pathname}
          currentPage={currentPage}
          language={languageFilter}
          source={videosFilter}
        />
      </div>
    )
  }

  onVideosLanguageChange(value) {
    const language = value === 'all' ? null : value
    this.props.changeVideosLanguageFilter(language)
  }

  buildFilters() {
    const { languageFilter, onlyFromPartners } = this.props

    const partnerFilter = {
      [ALL_VIDEOS]: {},
      [ONLY_PARTNERS]: { is_partner: true },
      [ONLY_COMMUNITY]: { is_partner: false },
      [ONLY_FEATURED]: { is_featured: true },
    }[onlyFromPartners]

    const languageVideosFilter = languageFilter ? { language: languageFilter } : {}

    return merge({}, partnerFilter, languageVideosFilter)
  }
}
