import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { get } from 'lodash'
import { withRouter } from 'react-router'

import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'

export const loggedInUserNotificationsQuery = gql`
  query LoggedInUserNotifications($page: Int! = 1, $pageSize: Int! = 30) {
    loggedInUser {
      notifications(page: $page, pageSize: $pageSize) {
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
              fullName
            }
            comment {
              text
            }
          }
        }
      }
    }
  }
`

const markAsSeenMutation = gql`
  mutation UpdateNotification($ids: [Int!], $seen: Boolean!) {
    updateNotifications(ids: $ids, seen: $seen) {
      id
      seenAt
    }
  }
`

/**
 * A connector to get a user's notifications
 */
const Notifications = ({ children, pageSize }) => {
  return (
    <Query query={loggedInUserNotificationsQuery} variables={{ pageSize }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingFrame />
        } else if (error) {
          return <ErrorView error={error} />
        }

        const paginatedNotifications = get(data, 'loggedInUser.notifications', {
          pageNumber: 1,
          totalPages: 1,
          entries: []
        })

        return (
          <Mutation mutation={markAsSeenMutation}>
            {markAsSeen => children({
              notifications: paginatedNotifications.entries,
              loading,
              error,
              pageNumber: paginatedNotifications.pageNumber,
              totalPages: paginatedNotifications.totalPages,
              markAsSeen: (ids, seen) => {
                return markAsSeen({
                  variables: Array.isArray(ids) ? { ids, seen } : { ids: [ids], seen }
                })
              }
            })
            }
          </Mutation>
        )
      }}
    </Query>
  )
}

export default withRouter(Notifications)
