import { useQuery, useSubscription } from '@apollo/client'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import {
  VIDEO_HISTORY_ACTION_ADDED_SUBSCRIPTION,
  VIDEO_HISTORY_ACTIONS_QUERY,
} from '../../API/graphql_queries'
import ActionsTable from '../UsersActions/ActionsTable'

const VideoDebateHistory = ({ videoId }) => {
  const [actions, setActions] = useState([])

  // Fetch initial history actions
  const { loading, data } = useQuery(VIDEO_HISTORY_ACTIONS_QUERY, {
    variables: { videoId },
    skip: !videoId,
  })

  // Subscribe to new actions
  useSubscription(VIDEO_HISTORY_ACTION_ADDED_SUBSCRIPTION, {
    variables: { videoId },
    skip: !videoId,
    onData: ({ data }) => {
      if (data?.data?.videoHistoryActionAdded) {
        const newAction = data.data.videoHistoryActionAdded
        setActions((prevActions) => [newAction, ...prevActions])
      }
    },
  })

  // Update actions when initial data loads
  useEffect(() => {
    if (data?.videoHistoryActions) {
      const sortedActions = [...data.videoHistoryActions].sort(
        (a, b) => new Date(b.time) - new Date(a.time),
      )
      setActions(sortedActions)
    }
  }, [data])

  // Clear actions when videoId changes
  useEffect(() => {
    setActions([])
  }, [videoId])

  return (
    <React.Fragment>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="videodebate-actions-history">
        <ActionsTable actions={actions} isLoading={loading} />
      </div>
    </React.Fragment>
  )
}

VideoDebateHistory.propTypes = {
  videoId: PropTypes.string.isRequired,
}

export default VideoDebateHistory
