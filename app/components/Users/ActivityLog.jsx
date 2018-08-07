import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { UserAction } from '../UsersActions/UserAction'


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
  <Query query={QUERY} variables={{username}}>
    {({loading, data: {user}}) => (
      !loading && (
        user.actions.map(a => {
          return (<UserAction key={a.id} action={a} withoutDiff/>)
        })
      )
    )}
  </Query>
)

export default ActivityLog
