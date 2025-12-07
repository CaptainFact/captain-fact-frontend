import React from 'react'
import { withTranslation } from 'react-i18next'
import { SearchBox as AlgoliaSearchBox } from 'react-instantsearch-dom'
import { withRouter } from 'react-router'

/** Global Search Box */
const SearchBox = ({ location, history, t }) => {
  return (
    <div className="[&_input[type='search']]:border [&_input[type='search']]:border-[lightgrey] dark:[&_input[type='search']]:border-border [&_input[type='search']]:p-2 [&_input[type='search']]:rounded [&_input[type='search']]:pl-8 [&_input[type='search']]:bg-[#fafafa] dark:[&_input[type='search']]:bg-background [&_input[type='search']]:text-sm [&_input[type='search']]:text-foreground dark:[&_input[type='search']]:text-foreground [&_input[type='search']]:outline-none [&_input[type='search']]:w-full [&_input[type='search']:focus]:border-[#6ba3a7] [&_input[type='search']:focus]:shadow-[0_0_0_0.125em_rgb(107_163_167_/_25%)] [&_button[type='submit']]:absolute [&_button[type='submit']]:left-2.5 [&_button[type='submit']]:top-3 [&_button[type='submit']]:border-0 [&_button[type='submit']]:cursor-pointer [&_button[type='submit']]:bg-none [&_button[type='submit']_svg]:w-[15px] [&_button[type='submit']_svg]:h-[15px] dark:[&_button[type='submit']_svg]:text-foreground [&_button[type='reset']]:absolute [&_button[type='reset']]:right-[15px] [&_button[type='reset']]:top-[15px] [&_button[type='reset']]:border-0 [&_button[type='reset']]:bg-none [&_button[type='reset']]:cursor-pointer dark:[&_button[type='reset']_svg]:text-foreground">
      <AlgoliaSearchBox
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
    </div>
  )
}

export default withTranslation('main')(withRouter(SearchBox))
