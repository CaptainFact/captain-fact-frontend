import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'

import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { toAbsoluteURL } from '../../lib/cf_routes'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import AddVideoBtn from './AddVideoBtn'
import PaginatedVideosContainer from './PaginatedVideosContainer'
import VideosFilterBar from './VideosFilterBar'

@withTranslation('main')
@withLoggedInUser
class VideosIndexPage extends React.PureComponent {
  render() {
    const {
      t,
      location,
      languageFilter,
      videosFilter,
      setVideosFilter,
      changeVideosLanguageFilter,
    } = this.props
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
        <div className="flex justify-between items-center max-w-[1315px] mx-auto px-5 pb-6 sm:pb-12 border-b border-neutral-100 dark:border-border">
          <h2 className="text-2xl dark:text-foreground">
            <strong>{t('menu.factChecking')}</strong>
            <span className="mx-1"> &rsaquo; </span>
            {t('entities.videoFactChecking')}
          </h2>
          {this.props.isAuthenticated && <AddVideoBtn />}
        </div>
        <div className="z-10 flex flex-col-reverse md:flex-row flex-wrap gap-5 justify-between items-center max-w-[1315px] px-5 pt-2 mx-auto mb-8 border-b border-neutral-200 dark:border-border bg-white dark:bg-background md:sticky static top-[60px] z-100 shadow-md">
          <VideosFilterBar
            onLanguageChange={(v) => {
              const language = v === 'all' ? null : v
              changeVideosLanguageFilter(language)
            }}
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
}

const VideosIndexPageWithPreferences = (props) => {
  const {
    videosLanguageFilter: languageFilter,
    videosFilter,
    changeVideosLanguageFilter,
    setVideosFilter,
  } = useUserPreferences()
  return (
    <VideosIndexPage
      {...props}
      languageFilter={languageFilter}
      videosFilter={videosFilter}
      changeVideosLanguageFilter={changeVideosLanguageFilter}
      setVideosFilter={setVideosFilter}
    />
  )
}

export default VideosIndexPageWithPreferences
