import { Query } from '@apollo/client/react/components'
import gql from 'graphql-tag'
import { Map } from 'immutable'
import { get } from 'lodash'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Tabs } from '../ui/tabs'
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

const renderPaginationMenu = (loading, user) => (
  <div className="bg-gray-50 p-4 w-full">
    <PaginationMenu
      disabled={loading}
      currentPage={user ? user.actions.pageNumber : 1}
      total={user ? user.actions.totalPages : 1}
      getPageLink={(page) => `?page=${page}`}
    />
  </div>
)

const getPaginationParams = (searchParams) => {
  const queryPage = parseInt(searchParams.get('page')) || 1
  const page = queryPage > 0 ? queryPage : 1
  return { limit: 20, page }
}

const ActivityLog = ({ match, t, location }) => {
  const searchParams = new URLSearchParams(location.search)
  const direction = searchParams.get('direction') || 'ALL'
  const paginationParams = getPaginationParams(searchParams)
  const username = match.params.username
  return (
    <Query
      query={QUERY}
      fetchPolicy="network-only"
      variables={{
        username,
        direction,
        offset: paginationParams.page, // API is wrong here: it uses page instead of offset
        limit: paginationParams.limit,
      }}
    >
      {({ loading, data, error }) => {
        if (error) {
          return <ErrorView error={error} />
        }

        const isEmpty = get(data, 'user.actions.entries.length') === 0
        return (
          <div className="container mx-auto max-w-[1200px] px-4 py-16">
            <Card className="content mx-auto">
              <Tabs defaultValue="ALL">
                <CardHeader>
                  <CardTitle className="mb-3">{t('main:menu.activity')}</CardTitle>
                  {data?.user && <ActionsDirectionFilter user={data.user} value={direction} />}
                </CardHeader>

                <CardContent>
                  {!data || loading ? (
                    <div className="p-4 border border-gray-200">
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
                </CardContent>

                {!isEmpty && (
                  <CardFooter>{renderPaginationMenu(loading, get(data, 'user'))}</CardFooter>
                )}
              </Tabs>
            </Card>
          </div>
        )
      }}
    </Query>
  )
}

export default withTranslation('user')(ActivityLog)
