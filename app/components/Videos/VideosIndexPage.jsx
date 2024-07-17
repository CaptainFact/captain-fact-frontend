import React from 'react'
import { Helmet } from 'react-helmet'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'

import { toAbsoluteURL } from '../../lib/cf_routes'
import { changeVideosLanguageFilter, setVideosFilter } from '../../state/user_preferences/reducer'
import Container from '../StyledUtils/Container'
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
@withNamespaces('main')
export default class VideosIndexPage extends React.PureComponent {
  render() {
    const { t, languageFilter, videosFilter, setVideosFilter, location } = this.props
    const searchParams = new URLSearchParams(location.search)
    const currentPage = parseInt(searchParams.get('page')) || 1

    return (
      <div className="videos-page">
        <Helmet>
          <meta property="og:url" content={toAbsoluteURL('/videos')} />
          <meta property="og:title" content="Les vidéos sourcées et vérifiées sur CaptainFact" />
          <meta
            property="og:description"
            content="Découvrez diverses vidéos sourcées et vérifiées par la communauté CaptainFact"
          />
        </Helmet>
        <Container
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          maxWidth="1315px"
          mx="auto"
          px="20px"
          pb="24px"
          borderBottom="1px solid #f7f7f7"
        >
          <h2 className="is-size-3">
            {t('menu.factChecking')}
            <span className="mx-1"> &rsaquo; </span>
            {t('entities.videoFactChecking')}
          </h2>
          <AddVideoBtn />
        </Container>
        <Container
          flexDirection={['column-reverse', 'row']}
          flexWrap="wrap"
          display="flex"
          gap="20px"
          justifyContent="space-between"
          alignItems="center"
          maxWidth="1315px"
          px="20px"
          py="15px"
          mx="auto"
          mb="32px"
          boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 10px -10px"
          borderBottom="1px solid #f2f2f2"
          bg="white"
          position={['initial', null, 'sticky']}
          css={{
            top: 60,
            zIndex: 100,
          }}
        >
          <VideosFilterBar
            onLanguageChange={(v) => this.onVideosLanguageChange(v)}
            onSourceChange={(v) => setVideosFilter(v)}
            language={languageFilter}
            source={videosFilter}
          />
        </Container>
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
}
