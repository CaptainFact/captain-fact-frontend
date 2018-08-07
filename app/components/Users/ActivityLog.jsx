import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'


const ActivityLog = () => (
  <Query query={gql`
    {

    }
  `}
  >
    {({loading, data}) => (
      null
    )}
  </Query>
)

export default ActivityLog
