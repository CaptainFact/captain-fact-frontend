import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { withNamespaces } from 'react-i18next'
import { Icon } from '../Utils/Icon'

const QUERY = gql`
  {
    allStatistics {
      totals {
        users
        statements
        sources
        comments
      }
    }
  }
`

const DEFAULT_STATS = {
  allStatistics: { totals: { users: 2000, statements: 900 } }
}

const Statistics = ({ t }) => (
  <Query query={QUERY}>
    {({ loading, error, data }) => {
      if (loading || error) {
        data = DEFAULT_STATS
      }

      const { users, statements } = data.allStatistics.totals
      return (
        <p className="columns is-size-5">
          <span className="column">
            <Icon name="user" /> {users} {t('registeredUsers')}
          </span>
          <span className="column">
            <Icon name="check" /> {statements} {t('verifiedStatements')}
          </span>
        </p>
      )
    }}
  </Query>
)

export default withNamespaces('home')(Statistics)
