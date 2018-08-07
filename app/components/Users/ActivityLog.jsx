import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { UserAction } from '../UsersActions/UserAction'
import PaginationMenu from '../Utils/PaginationMenu'


const QUERY = gql`
  query UserActivityLog($username: String!) {
    user(username: $username) {
      actions {
        id
        type
        entity
        time
        user {
          id
          name
          username
        }
      }
    }
  }
`

const ActivityLog = ({params: {username}}) => (
  <Query query={QUERY} variables={{username}} fetchPolicy="cache-and-network">
    {({loading, data: {user}}) => (
      !loading && (
        <div className="activity-log container">
          <p className="panel-heading">
            <PaginationMenu/>
          </p>
          {user.actions.map(a => {
            return (<UserAction key={a.id} action={a} withoutDiff withoutUser/>)
          })}
          <p className="panel-heading">
            <PaginationMenu/>
          </p>
        </div>
      )
    )}
  </Query>
)

export default ActivityLog
