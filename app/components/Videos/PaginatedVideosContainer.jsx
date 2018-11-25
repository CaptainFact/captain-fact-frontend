import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router'
import gql from 'graphql-tag'
import { withNamespaces } from 'react-i18next'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import { VideosGrid } from './VideosGrid'
import PaginationMenu from '../Utils/PaginationMenu'
import { ALL_VIDEOS, ONLY_PARTNERS } from '../../constants'

const QUERY = gql`
  query VideosIndex($offset: Int!, $limit: Int!, $filters: VideoFilter) {
    videos(limit: $limit, offset: $offset, filters: $filters) {
      pageNumber
      totalPages
      entries {
        hash_id: hashId
        provider_id: providerId
        provider
        title
        insertedAt
        isPartner
        speakers {
          full_name: fullName
          id
          slug
        }
      }
    }
  }
`

const INITIAL_VIDEOS = { pageNumber: 1, totalPages: 1, entries: [] }

const buildFiltersFromProps = ({ language, source, speakerID }) => {
  const filters = {}
  const onlyPartnersFilter = source && source !== ALL_VIDEOS
  if (language) filters.language = language
  if (onlyPartnersFilter) filters.is_partner = source === ONLY_PARTNERS
  if (speakerID) filters.speaker_id = speakerID
  return filters
}

const PaginatedVideosContainer = ({
  t,
  currentPage = 1,
  baseURL,
  ...props
}) => {
  const filters = buildFiltersFromProps(props)
  return (
    <Query
      query={QUERY}
      variables={{ offset: currentPage, limit: 16, filters }}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        const videos = (data && data.videos) || INITIAL_VIDEOS
        if (error) return <ErrorView error={error} />
        if (!loading && videos.entries.length === 0)
          return <h2>{t('errors:client.noVideoAvailable')}</h2>

        const paginationMenu = (
          <PaginationMenu
            className="videos-pagination"
            currentPage={videos.pageNumber}
            total={videos.totalPages}
            isRounded
            onPageChange={() => window.scrollTo({ top: 0 })}
            LinkBuilder={({ 'data-page': page, ...props }) => {
              const urlParams = page > 1 ? `?page=${page}` : ''
              return (
                <Link
                  to={`${baseURL}${urlParams}`}
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
            {loading ? (
              <LoadingFrame />
            ) : (
              <VideosGrid videos={videos.entries} />
            )}
            {paginationMenu}
          </div>
        )
      }}
    </Query>
  )
}

export default withNamespaces('main')(PaginatedVideosContainer)
