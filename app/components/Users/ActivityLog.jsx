import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Map } from 'immutable'
import { translate } from 'react-i18next'

import UserAction from '../UsersActions/UserAction'
import PaginationMenu from '../Utils/PaginationMenu'
import { LoadingFrame } from '../Utils/LoadingFrame'
import MessageView from '../Utils/MessageView'


const QUERY = gql`
  query UserActivityLog($username: String!, $offset: Int!, $limit: Int!) {
    user(username: $username) {
      actions(limit: $limit, offset: $offset) {
        pageNumber
        totalPages
        entries {
          id
          type
          entity
          entityId
          time
          changes
          context
          targetUser {
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
      onPageChange={selectedPage => fetchMore({
        variables: {offset: selectedPage},
        updateQuery: (_, {fetchMoreResult}) => fetchMoreResult
      })}
    />
  </div>
)

const ActivityLog = ({params: {username}, t}) => (
  <Query
    query={QUERY}
    variables={{username, offset: 1, limit: 10}}
    fetchPolicy="cache-and-network"
  >
    {({loading, data: {user}, fetchMore}) => {
      if (!loading && user.actions.entries.length === 0) {
        return (<MessageView>{t('noActivity')}</MessageView>)
      }

      const paginationMenu = renderPaginationMenu(loading, user, fetchMore)
      return (
        <div className="activity-log container">
          {paginationMenu}
          {loading
            ? <div className="panel-block"><LoadingFrame /></div>
            : user.actions.entries.map(a => (
              <UserAction
                key={a.id}
                action={{...a, changes: new Map(JSON.parse(a.changes))}}
                withoutUser
              />
            ))
          }
          {paginationMenu}
        </div>
      )
    }}
  </Query>
)

export default translate('user')(ActivityLog)
