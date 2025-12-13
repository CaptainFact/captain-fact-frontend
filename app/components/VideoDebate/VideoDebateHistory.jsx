import { useQuery, useSubscription } from '@apollo/client'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import {
  VIDEO_HISTORY_ACTION_ADDED_SUBSCRIPTION,
  VIDEO_HISTORY_ACTIONS_QUERY,
} from '../../API/graphql_queries'
import ActionsTable from '../UsersActions/ActionsTable'
import { ErrorView } from '../Utils/ErrorView'

const VideoDebateHistory = ({ videoId }) => {
  // Fetch initial history actions
  const { loading, data, error, client } = useQuery(VIDEO_HISTORY_ACTIONS_QUERY, {
    variables: { videoId },
    skip: !videoId,
    fetchPolicy: 'cache-and-network',
  })

  // Subscribe to new actions
  useSubscription(VIDEO_HISTORY_ACTION_ADDED_SUBSCRIPTION, {
    variables: { videoId },
    skip: !videoId,
    onData: ({ data }) => {
      if (data?.data?.videoHistoryActionAdded) {
        const newAction = data.data.videoHistoryActionAdded

        // Update the cache by adding the new action to the existing query
        client.cache.updateQuery(
          {
            query: VIDEO_HISTORY_ACTIONS_QUERY,
            variables: { videoId },
          },
          (existingData) => {
            if (!existingData) {
              return existingData
            }

            return {
              ...existingData,
              videoHistoryActions: [newAction, ...existingData.videoHistoryActions],
            }
          },
        )
      }
    },
  })

  return (
    <React.Fragment>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="videodebate-actions-history">
        {error ? (
          <ErrorView error={error} canGoBack={false} />
        ) : (
          <ActionsTable actions={data?.videoHistoryActions || []} isLoading={loading} />
        )}
      </div>
    </React.Fragment>
  )
}

VideoDebateHistory.propTypes = {
  videoId: PropTypes.string.isRequired,
}

export default VideoDebateHistory
