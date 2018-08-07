import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { UserAction } from '../UsersActions/UserAction'


const ActivityLog = () => (
  <Query query={gql`
    {
      user(username: "coucou") {
        actions {
          id
          type
          entity
          user {
            id
            name
            username
          }
        }
      }
    }
  `}
  >
    {({loading, data: {user}}) => (
      !loading && (
        user.actions.map(a => (
          <UserAction key={a.id} action={a} withoutDiff/>
        ))
      )
    )}
  </Query>
)

export default ActivityLog
