import { Mutation, Query } from '@apollo/client/react/components'
import gql from 'graphql-tag'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router-dom'

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
              name
              username
            }
            video {
              hashId
              title
            }
            speaker {
              id
              slug
              fullName
            }
            comment {
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
 * A connector to get a user's notifications
 */
const Notifications = ({ children, pageSize, pageNumber, pollInterval, filter }) => {
  return (
    <Query
      query={loggedInUserNotificationsQuery}
      variables={{ filter, pageSize, page: pageNumber }}
      pollInterval={pollInterval}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        const paginatedNotifications = get(data, 'loggedInUser.notifications', {
          pageNumber: 1,
          totalPages: 1,
          entries: [],
        })

        return (
          <Mutation
            mutation={markAsSeenMutation}
            refetchQueries={() => ['LoggedInUserUnreadNotificationsCount']}
          >
            {(markAsSeen) =>
              children({
                notifications: paginatedNotifications.entries,
                loading,
                error,
                pageNumber: paginatedNotifications.pageNumber,
                totalPages: paginatedNotifications.totalPages,
                markAsSeen: (ids, seen) => {
                  return markAsSeen({
                    variables: Array.isArray(ids) ? { ids, seen } : { ids: [ids], seen },
                  })
                },
              })
            }
          </Mutation>
        )
      }}
    </Query>
  )
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

export default withRouter(Notifications)
