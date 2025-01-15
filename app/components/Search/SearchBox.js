import React from 'react'
import { withTranslation } from 'react-i18next'
import { SearchBox as AlgoliaSearchBox } from 'react-instantsearch-dom'
import { withRouter } from 'react-router'
import styled from 'styled-components'

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
    left: 10px;
    top: 12px;
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
const SearchBox = ({ location, history, t }) => {
  return (
    <StyledSearchBox
      translations={{ placeholder: t('search.placeholder') }}
      searchAsYouType={false}
      onSubmit={(e) => {
        e.preventDefault()
        const term = e.target.elements[0].value
        const isSearchPage = location.pathname.startsWith('/search')
        const route = isSearchPage ? location.pathname : '/search'
        history.push(`${route}?term=${encodeURIComponent(term)}`)
      }}
      onReset={(e) => {
        e.preventDefault()
        const isSearchPage = location.pathname.startsWith('/search')
        const route = isSearchPage ? location.pathname : '/search'
        history.push(route)
      }}
    />
  )
}

export default withTranslation('main')(withRouter(SearchBox))
