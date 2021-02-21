import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { get } from 'lodash'

import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import { StatementsGrid } from './StatementsGrid'
import PaginationMenu from '../Utils/PaginationMenu'
import { StatementsQuery } from '../../API/graphql_queries'
import styled from 'styled-components'

const INITIAL_STATEMENTS = { pageNumber: 1, totalPages: 1, entries: [] }

const StatementPaginationMenu = styled(PaginationMenu)`
  && {
    margin: 0 auto 1em auto;
    max-width: 600px;
  }
`

const buildFiltersFromProps = ({ commentedStatements }) => {
  const filters = {}

  filters.commented = commentedStatements

  return filters
}

const PaginatedStatementsContainer = ({
  t,
  baseURL,
  query = StatementsQuery,
  queryArgs = {},
  statementsPath = 'statements',
  showPagination = true,
  currentPage = 1,
  limit = 16,
  ...props
}) => {
  const filters = buildFiltersFromProps(props)
  return (
    <Query
      query={query}
      variables={{ offset: currentPage, limit, filters, ...queryArgs }}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        const statements = get(data, statementsPath, INITIAL_STATEMENTS)
        if (error) {
          return <ErrorView error={error} />
        }
        if (!loading && statements.entries.length === 0) {
          // TODO: change this error !
          return <h2>{t('errors:client.noVideoAvailable')}</h2>
        }

        const paginationMenu = !showPagination ? null : (
          <StatementPaginationMenu
            currentPage={statements.pageNumber}
            total={statements.totalPages}
            isRounded
            onPageChange={() => window.scrollTo({ top: 0 })}
            LinkBuilder={({ 'data-page': page, ...props }) => {
              const urlParams = page > 1 ? `?page=${page}` : ''
              return <Link to={`${baseURL}${urlParams}`} className="button" {...props} />
            }}
          />
        )

        return (
          <div>
            {paginationMenu}
            {loading ? <LoadingFrame /> : <StatementsGrid statements={statements.entries} />}
            {paginationMenu}
          </div>
        )
      }}
    </Query>
  )
}

export default withNamespaces('main')(PaginatedStatementsContainer)
