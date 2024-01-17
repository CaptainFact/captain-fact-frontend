import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connectStateResults, Index } from 'react-instantsearch'

const SearchResultsCount = connectStateResults(({ searchResults }) => {
  return get(searchResults, 'nbHits', 0)
})

const IndexSearchEntriesCount = ({ indexName }) => {
  return (
    <Index indexName={indexName}>
      <SearchResultsCount />
    </Index>
  )
}

IndexSearchEntriesCount.propTypes = {
  indexName: PropTypes.string,
}

export default IndexSearchEntriesCount
