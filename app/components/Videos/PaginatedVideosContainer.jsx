import { Query } from '@apollo/client/react/components'
import { get } from 'lodash'
import { VideoOff } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { VideosQuery } from '../../API/graphql_queries'
import { ONLY_FEATURED, ONLY_PARTNERS } from '../../constants'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import PaginationMenu from '../Utils/PaginationMenu'
import { VideosGrid } from './VideosGrid'

const INITIAL_VIDEOS = { pageNumber: 1, totalPages: 1, entries: [] }

const buildFiltersFromProps = ({ language, source, speakerID }) => {
  const filters = {}

  if (language) {
    filters.language = language
  }

  if (speakerID) {
    filters.speaker_id = speakerID
  }

  if (source === ONLY_FEATURED) {
    filters.is_featured = true
  } else if (source === ONLY_PARTNERS) {
    filters.is_partner = true
  }

  return filters
}

const PaginatedVideosContainer = ({
  t,
  baseURL,
  query = VideosQuery,
  queryArgs = {},
  videosPath = 'videos',
  showPagination = true,
  currentPage = 1,
  limit = 16,
  ...props
}) => {
  const filters = buildFiltersFromProps(props)
  return (
    <Query
      query={query}
      variables={{ offset: currentPage, limit, filters, ...queryArgs }}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        const videos = get(data, videosPath, INITIAL_VIDEOS)
        if (error) {
          return (
            <div className="w-fit mx-auto">
              <ErrorView error={error} />
            </div>
          )
        }
        if (!loading && videos.entries.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center my-12">
              <div className="bg-neutral-100 rounded-full p-6">
                <VideoOff size={64} />
              </div>
              <p className="text-xl mt-4 font-bold">{t('errors:client.noVideoAvailable')}</p>
            </div>
          )
        }

        const paginationMenu = !showPagination ? null : (
          <PaginationMenu
            className="mt-12"
            currentPage={videos.pageNumber}
            total={videos.totalPages}
            getPageLink={(page) => `${baseURL}?page=${page}`}
          />
        )

        return (
          <div>
            {loading ? <LoadingFrame /> : <VideosGrid videos={videos.entries} />}
            {paginationMenu}
          </div>
        )
      }}
    </Query>
  )
}

export default withTranslation('main')(PaginatedVideosContainer)
