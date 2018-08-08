import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { UserAction } from '../UsersActions/UserAction'
import PaginationMenu from '../Utils/PaginationMenu'
import { LoadingFrame } from '../Utils/LoadingFrame'


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
    {({loading, data: {user}}) => {
      const paginationMenu = (
        <div className="panel-heading">
          <PaginationMenu disabled={loading}/>
        </div>
      )

      return (
        <div className="activity-log container">
          {paginationMenu}
          {loading
            ? <div className="panel-block"><LoadingFrame /></div>
            : user.actions.map(a => {
              return (<UserAction key={a.id} action={a} withoutDiff withoutUser/>)
            })
          }
          {paginationMenu}
        </div>
      )
    }}
  </Query>
)

export default ActivityLog
