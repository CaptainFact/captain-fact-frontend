import React from 'react'
import { SearchBox as AlgoliaSearchBox } from 'react-instantsearch-dom'
import styled from 'styled-components'
import { withNamespaces } from 'react-i18next'
import { withRouter } from 'react-router'

const StyledSearchBox = styled(AlgoliaSearchBox)`
  input[type='search'] {
    border: 1px solid lightgrey;
    padding: 8px;
    border-radius: 4px;
    padding-left: 32px;
    background: #fafafa;
    font-size: 14px;
    outline: none;
    width: 100%;
    &:focus {
      border-color: #6ba3a7;
      box-shadow: 0 0 0 0.125em rgb(107 163 167 / 25%);
    }
  }

  button[type='submit'] {
    position: absolute;
    left: 4px;
    top: 8px;
    border: none;
    cursor: pointer;
    background: none;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  button[type='reset'] {
    position: absolute;
    right: 6px;
    top: 10px;
    border: none;
    background: none;
    cursor: pointer;
  }
`

/** Global Search Box */
const SearchBox = ({ router, t }) => {
  return (
    <StyledSearchBox
      translations={{ placeholder: t('search.placeholder') }}
      searchAsYouType={false}
      onSubmit={(e) => {
        e.preventDefault()
        const term = e.target.elements[0].value
        const isSearchPage = router.location.pathname.startsWith('/search')
        const route = isSearchPage ? router.location.pathname : '/search'
        router.push({ pathname: route, query: { term } })
      }}
      onReset={(e) => {
        e.preventDefault()
        const isSearchPage = router.location.pathname.startsWith('/search')
        const route = isSearchPage ? router.location.pathname : '/search'
        router.push({ pathname: route })
      }}
    />
  )
}

export default withNamespaces('main')(withRouter(SearchBox))
