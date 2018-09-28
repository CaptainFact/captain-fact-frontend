import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router'
import gql from 'graphql-tag'
import { translate } from 'react-i18next'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import { VideosGrid } from './VideosGrid'
import PaginationMenu from '../Utils/PaginationMenu'


const QUERY = gql`
  query VideosIndex($offset: Int!, $limit: Int!) {
    videos(limit: $limit, offset: $offset) {
      pageNumber
      totalPages
      entries {
        hash_id: hashId
        provider_id: providerId
        provider
        speakers {
          full_name: fullName
          id
          slug
        }
        title
      }
    }
  }
`

const INITIAL_VIDEOS = { pageNumber: 1, totalPages: 1, entries: [] }

const PaginatedVideosContainer = ({ t, currentPage = 1 }) => {
  return (
    <Query
      query={QUERY}
      variables={{ offset: currentPage, limit: 16 }}
      fetchPolicy="network-only"
    >
      {
        (({ loading, error, data }) => {
          const videos = data.videos || INITIAL_VIDEOS
          if (error)
            return <ErrorView error={error} />
          if (!loading && videos.entries.length === 0)
            return <h2>{t('errors:client.noVideoAvailable')}</h2>

          const paginationMenu = (
            <PaginationMenu
              currentPage={videos.pageNumber}
              total={videos.totalPages}
              isRounded
              onPageChange={() => window.scrollTo({ top: 0 })}
              LinkBuilder={({ 'data-page': page, ...props }) => {
                const urlParams = page > 1 ? `?page=${page}` : ''
                return (
                  <Link
                    to={`videos${urlParams}`}
                    className="button"
                    {...props}
                  />
                )
              }}
            />
          )

          return (
            <div>
              {paginationMenu}
              {loading
                ? (<LoadingFrame />)
                : (<VideosGrid videos={videos.entries} />)
              }
              {paginationMenu}
            </div>
          )
        })
      }
    </Query>
  )
}

export default translate('main')(PaginatedVideosContainer)
