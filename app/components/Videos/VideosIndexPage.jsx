import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { toAbsoluteURL } from '../../lib/cf_routes'
import { changeVideosLanguageFilter, setVideosFilter } from '../../state/user_preferences/reducer'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import AddVideoBtn from './AddVideoBtn'
import PaginatedVideosContainer from './PaginatedVideosContainer'
import VideosFilterBar from './VideosFilterBar'

@connect(
  (state) => ({
    languageFilter: state.UserPreferences.videosLanguageFilter,
    videosFilter: state.UserPreferences.videosFilter,
  }),
  { changeVideosLanguageFilter, setVideosFilter },
)
@withTranslation('main')
@withLoggedInUser
export default class VideosIndexPage extends React.PureComponent {
  render() {
    const { t, languageFilter, videosFilter, setVideosFilter, location } = this.props
    const searchParams = new URLSearchParams(location.search)
    const currentPage = parseInt(searchParams.get('page')) || 1

    return (
      <div className="py-16">
        <Helmet>
          <meta property="og:url" content={toAbsoluteURL('/videos')} />
          <meta property="og:title" content="Les vidéos sourcées et vérifiées sur CaptainFact" />
          <meta
            property="og:description"
            content="Découvrez diverses vidéos sourcées et vérifiées par la communauté CaptainFact"
          />
        </Helmet>
        <div className="flex justify-between items-center max-w-[1315px] mx-auto px-5 pb-6 sm:pb-12 border-b border-neutral-100">
          <h2 className="text-2xl">
            <strong>{t('menu.factChecking')}</strong>
            <span className="mx-1"> &rsaquo; </span>
            {t('entities.videoFactChecking')}
          </h2>
          {this.props.isAuthenticated && <AddVideoBtn />}
        </div>
        <div className="z-10 flex flex-col-reverse md:flex-row flex-wrap gap-5 justify-between items-center max-w-[1315px] px-5 pt-2 mx-auto mb-8 border-b border-neutral-200 bg-white md:sticky static top-[60px] z-100 shadow-md">
          <VideosFilterBar
            onLanguageChange={(v) => this.onVideosLanguageChange(v)}
            onSourceChange={(v) => setVideosFilter(v)}
            language={languageFilter}
            source={videosFilter}
          />
        </div>
        <div className="mx-auto max-w-[1315px]">
          <PaginatedVideosContainer
            baseURL={this.props.location.pathname}
            currentPage={currentPage}
            language={languageFilter}
            source={videosFilter}
          />
        </div>
      </div>
    )
  }

  onVideosLanguageChange(value) {
    const language = value === 'all' ? null : value
    this.props.changeVideosLanguageFilter(language)
  }
}
