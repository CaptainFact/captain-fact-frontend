import { capitalize } from 'lodash'
import React from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { connectSearchBox, Index, InfiniteHits } from 'react-instantsearch-dom'
import { Link } from 'react-router-dom'
import { Search as SearchIcon } from 'styled-icons/fa-solid'

import { ENTITY_SPEAKER, ENTITY_STATEMENT, ENTITY_VIDEO } from '../../constants'
import { ALGOLIA_INDEXES_NAMES } from '../../lib/algolia'
import { optionsToQueryString } from '../../lib/url_utils'
import IndexSearchEntriesCount from './IndexSearchEntriesCount'
import SearchBox from './SearchBox'
import { SpeakerHit } from './SpeakerHit'
import StatementHit from './StatementHit'
import { VideoHit } from './VideoHit'

const ENTITIES_COMPONENTS = {
  [ENTITY_VIDEO]: VideoHit,
  [ENTITY_SPEAKER]: SpeakerHit,
  [ENTITY_STATEMENT]: StatementHit,
}

const ROUTES_ENTITIES = {
  undefined: ENTITY_VIDEO,
  videos: ENTITY_VIDEO,
  speakers: ENTITY_SPEAKER,
  statements: ENTITY_STATEMENT,
}

const SearchPage = ({ t, refine, match, location }) => {
  const searchParams = new URLSearchParams(location.search)
  const rawTerm = searchParams.get('term')
  const term = rawTerm ? decodeURIComponent(rawTerm) : ''

  React.useEffect(() => {
    refine(term)
  }, [term])

  const selectedEntity = ROUTES_ENTITIES[match.params.entity]
  return (
    <div className="flex flex-col min-h-full bg-[#f4f5f8]">
      <div className="bg-white">
        <div className="lg:px-12 lg:pt-12 pt-8 px-4">
          <div className="relative max-w-[600px] flex-1 mb-3 block md:hidden">
            <SearchBox />
          </div>
          <h2 className="text-xl font-normal text-[#363636]">
            <Trans i18nKey="search.results" query={term}>
              Search results for: <strong>{{ query: term || '…' }}</strong>
            </Trans>
          </h2>
          <p className="text-[#8c8c8c] text-sm mt-1 italic">Powered by Algolia</p>
        </div>
        <div className="mt-8">
          <ul className="flex border-b border-[#dbdbdb] px-4 lg:px-10 flex-wrap">
            {Object.keys(ENTITIES_COMPONENTS).map((entity) => (
              <li
                key={entity}
                className={`mr-2 ${selectedEntity === entity ? 'border-b-2 border-primary' : ''}`}
              >
                <Link
                  to={{ pathname: `/search/${entity}s`, search: optionsToQueryString({ term }) }}
                  className={`flex items-center px-4 py-2 text-sm ${
                    selectedEntity === entity
                      ? 'text-primary'
                      : 'text-[#4a4a4a] hover:text-[#363636]'
                  }`}
                >
                  <SearchIcon size="1em" className="mr-1" />
                  {capitalize(t(`entities.${entity}`, { count: 5 }))}
                  {term && (
                    <span className="ml-1">
                      (<IndexSearchEntriesCount indexName={ALGOLIA_INDEXES_NAMES[entity]} />)
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {!term ? (
        <div className="flex flex-col justify-center items-center flex-1">
          <SearchIcon size={64} />
          <p className="mt-4 text-center px-2">
            <Trans i18nKey="search.noQuery">
              Type something in the search bar above to start searching
            </Trans>
          </p>
        </div>
      ) : (
        <div className="p-3 pb-8">
          <Index indexName={ALGOLIA_INDEXES_NAMES[selectedEntity]}>
            <div className="[&_.ais-InfiniteHits]:flex [&_.ais-InfiniteHits]:flex-col [&_.ais-InfiniteHits]:items-center">
              <div className="[&_.ais-InfiniteHits-list]:grid [&_.ais-InfiniteHits-list]:grid-cols-1 [&_.ais-InfiniteHits-list]:gap-4 [&_.ais-InfiniteHits-list]:w-full sm:[&_.ais-InfiniteHits-list]:grid-cols-2 lg:[&_.ais-InfiniteHits-list]:grid-cols-3 xl:[&_.ais-InfiniteHits-list]:grid-cols-4 [&_.ais-InfiniteHits-list_.ais-InfiniteHits-item>div]:w-full">
                <InfiniteHits
                  translations={{ loadMore: t('search.loadMore') }}
                  hitComponent={ENTITIES_COMPONENTS[selectedEntity]}
                  className="[&_.ais-InfiniteHits-loadMore]:bg-transparent [&_.ais-InfiniteHits-loadMore]:border-[#6ba3a7] [&_.ais-InfiniteHits-loadMore]:text-[#6ba3a7] [&_.ais-InfiniteHits-loadMore]:cursor-pointer [&_.ais-InfiniteHits-loadMore]:justify-center [&_.ais-InfiniteHits-loadMore]:px-3 [&_.ais-InfiniteHits-loadMore]:py-2 [&_.ais-InfiniteHits-loadMore]:text-center [&_.ais-InfiniteHits-loadMore]:whitespace-nowrap [&_.ais-InfiniteHits-loadMore]:border [&_.ais-InfiniteHits-loadMore]:rounded [&_.ais-InfiniteHits-loadMore]:mt-10 [&_.ais-InfiniteHits-loadMore:disabled]:hidden"
                />
              </div>
            </div>
          </Index>
        </div>
      )}
    </div>
  )
}

export default withTranslation('main')(connectSearchBox(SearchPage))
