import { Query } from '@apollo/client/react/components'
import gql from 'graphql-tag'
import { Map } from 'immutable'
import { get } from 'lodash'
import React from 'react'
import { withNamespaces } from 'react-i18next'

import ActionsDirectionFilter from '../UsersActions/ActionsDirectionFilter'
import UserAction from '../UsersActions/UserAction'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import MessageView from '../Utils/MessageView'
import PaginationMenu from '../Utils/PaginationMenu'

const QUERY = gql`
  query UserActivityLog(
    $username: String!
    $offset: Int!
    $limit: Int!
    $direction: ActivityLogDirection!
  ) {
    user(username: $username) {
      id
      username
      name
      actions(limit: $limit, offset: $offset, direction: $direction) {
        pageNumber
        totalPages
        entries {
          id
          type
          entity
          time
          changes
          videoHashId
          statementId
          commentId
          speakerId
          authorReputationChange
          targetReputationChange
          userId
          user {
            id
            username
            name
          }
          targetUserId
          targetUser {
            id
            username
            name
          }
        }
      }
    }
  }
`

const renderPaginationMenu = (loading, user, fetchMore) => (
  <div className="panel-heading">
    <PaginationMenu
      disabled={loading}
      currentPage={user ? user.actions.pageNumber : 1}
      total={user ? user.actions.totalPages : 1}
      onPageChange={(selectedPage) =>
        fetchMore({
          variables: { offset: selectedPage },
          updateQuery: (_, { fetchMoreResult }) => fetchMoreResult,
        })
      }
    />
  </div>
)

const ActivityLog = ({ match, t, location }) => {
  const searchParams = new URLSearchParams(location.search)
  const direction = searchParams.get('direction') || 'ALL'
  const username = match.params.username
  return (
    <Query
      query={QUERY}
      variables={{ username, offset: 1, limit: 10, direction }}
      fetchPolicy="network-only"
    >
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return <ErrorView error={error} />
        }

        const isEmpty = get(data, 'user.actions.entries.length') === 0
        return (
          <div>
            <div className="activity-log container">
              <p className="panel-heading">{t('main:menu.activity')}</p>
              {get(data, 'user') && <ActionsDirectionFilter user={data.user} value={direction} />}
              {!data || loading ? (
                <div className="panel-block">
                  <LoadingFrame />
                </div>
              ) : isEmpty ? (
                <MessageView>{t('noActivity')}</MessageView>
              ) : (
                data.user.actions.entries.map((a) => (
                  <UserAction
                    key={a.id}
                    action={{ ...a, changes: new Map(JSON.parse(a.changes)) }}
                    withoutUser
                    viewingFrom={data.user}
                  />
                ))
              )}
              {!isEmpty && renderPaginationMenu(loading, get(data, 'user'), fetchMore)}
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default withNamespaces('user')(ActivityLog)
