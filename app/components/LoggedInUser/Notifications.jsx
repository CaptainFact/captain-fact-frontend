import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

const loggedInUserNotificationsQuery = gql`
  query LoggedInUserNotifications(
    $page: Int! = 1
    $pageSize: Int! = 30
    $filter: NotificationsFilter = ALL
  ) {
    loggedInUser {
      id
      notifications(page: $page, pageSize: $pageSize, filter: $filter) {
        pageNumber
        pageSize
        totalEntries
        totalPages
        entries {
          id
          seenAt
          insertedAt
          type
          action {
            entity
            type
            speakerId
            statementId
            commentId
            user {
              id
              name
              username
            }
            video {
              id
              hashId
              title
            }
            speaker {
              id
              slug
              fullName
            }
            comment {
              id
              text
            }
            changes
          }
        }
      }
    }
  }
`

const markAsSeenMutation = gql`
  mutation UpdateNotification($ids: [ID]!, $seen: Boolean!) {
    updateNotifications(ids: $ids, seen: $seen) {
      id
      seenAt
    }
  }
`

/**
 * Hook to get a user's notifications
 */
const useNotifications = ({ pageSize, pageNumber, pollInterval, filter }) => {
  const { loading, error, data } = useQuery(loggedInUserNotificationsQuery, {
    variables: { filter, pageSize, page: pageNumber },
    pollInterval,
    fetchPolicy: 'network-only',
  })

  const [markAsSeenMutationFn] = useMutation(markAsSeenMutation, {
    refetchQueries: () => ['LoggedInUserUnreadNotificationsCount'],
  })

  const paginatedNotifications = useMemo(
    () =>
      get(data, 'loggedInUser.notifications', {
        pageNumber: 1,
        totalPages: 1,
        entries: [],
      }),
    [data],
  )

  const markAsSeen = (ids, seen) => {
    return markAsSeenMutationFn({
      variables: Array.isArray(ids) ? { ids, seen } : { ids: [ids], seen },
    })
  }

  return {
    notifications: paginatedNotifications.entries,
    loading,
    error,
    pageNumber: paginatedNotifications.pageNumber,
    totalPages: paginatedNotifications.totalPages,
    markAsSeen,
  }
}

/**
 * A connector to get a user's notifications (deprecated - use useNotifications hook instead)
 */
const Notifications = ({ children, pageSize, pageNumber, pollInterval, filter }) => {
  const notificationsData = useNotifications({ pageSize, pageNumber, pollInterval, filter })
  return children(notificationsData)
}

Notifications.propTypes = {
  children: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  pageNumber: PropTypes.number,
  filter: PropTypes.oneOf(['ALL', 'SEEN', 'UNSEEN']),
  pollInterval: PropTypes.number,
}

Notifications.defaultProps = {
  /** Default refresh interval in ms. Default = 15s. Set to 0 to disable. */
  pollInterval: 15000,
  filter: 'ALL',
}

export default Notifications
