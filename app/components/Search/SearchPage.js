import React from 'react'
import { withNamespaces, Trans } from 'react-i18next'
import { connectSearchBox, Index, InfiniteHits } from 'react-instantsearch-dom'
import styled from 'styled-components'
import { Link } from 'react-router'
import capitalize from 'voca/capitalize'
import { Search as SearchIcon } from 'styled-icons/fa-solid'

import Container from '../StyledUtils/Container'
import { P } from '../StyledUtils/Text'
import { ENTITY_SPEAKER, ENTITY_STATEMENT, ENTITY_VIDEO } from '../../constants'
import IndexSearchEntriesCount from './IndexSearchEntriesCount'
import { VideoHit } from './VideoHit'
import { SpeakerHit } from './SpeakerHit'
import StatementHit from './StatementHit'
import { ALGOLIA_INDEXES_NAMES } from '../../lib/algolia'
import SearchBox from './SearchBox'

const MainContainer = styled.div`
  background: #f4f5f8;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .ais-InfiniteHits {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ais-InfiniteHits-list {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;

    @media (min-width: 500px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media (min-width: 1408px) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .ais-InfiniteHits-item > .column {
      width: 100%;
    }
  }

  .ais-InfiniteHits-loadMore {
    background-color: transparent;
    border-color: #6ba3a7;
    color: #6ba3a7;
    cursor: pointer;
    justify-content: center;
    padding-bottom: calc(0.375em - 1px);
    padding-left: 0.75em;
    padding-right: 0.75em;
    padding-top: calc(0.375em - 1px);
    text-align: center;
    white-space: nowrap;
    border: 1px solid;
    padding: 8px;
    border-radius: 4px;
    margin-top: 40px;

    &:disabled {
      display: none;
    }
  }
`

const SearchTabsUl = styled.ul`
  padding: 0px 25px;
`

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

const SearchPage = ({ t, refine, router }) => {
  const rawTerm = router.location.query.term
  const term = rawTerm ? decodeURIComponent(rawTerm) : ''

  React.useEffect(() => {
    refine(term)
  }, [term])

  const selectedEntity = ROUTES_ENTITIES[router.params.entity]
  return (
    <MainContainer>
      <Container background="white">
        <Container px={4} mt={4}>
          <Container
            display={['block', 'none']}
            position="relative"
            maxWidth="600px"
            flex="1 1"
            mb={3}
          >
            <SearchBox />
          </Container>
          <P fontSize="18px">
            <Trans i18nKey="search.results" query={term}>
              Search results for: <strong>{{ query: term || '…' }}</strong>
            </Trans>
          </P>
          <P color="black.300" fontStyle="italic">
            Powered by Algolia
          </P>
        </Container>
        <Container className="tabs" mt={3}>
          <SearchTabsUl>
            {Object.keys(ENTITIES_COMPONENTS).map((entity) => (
              <li key={entity} className={selectedEntity === entity ? 'is-active' : ''}>
                <Link to={{ pathname: `/search/${entity}s`, query: { term } }}>
                  <SearchIcon size="1em" />
                  &nbsp; {capitalize(t(`entities.${entity}`, { count: 5 }))}
                  {term && (
                    <React.Fragment>
                      &nbsp;(
                      <IndexSearchEntriesCount indexName={ALGOLIA_INDEXES_NAMES[entity]} />)
                    </React.Fragment>
                  )}
                </Link>
              </li>
            ))}
          </SearchTabsUl>
        </Container>
      </Container>
      {!term ? (
        <Container
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          flex=" 1 1"
        >
          <SearchIcon size={64} />
          <P mt={4} textAlign="center" px={2}>
            <Trans i18nKey="search.noQuery">
              Type something in the search bar above to start searching
            </Trans>
          </P>
        </Container>
      ) : (
        <Container p={3}>
          <Index indexName={ALGOLIA_INDEXES_NAMES[selectedEntity]}>
            <InfiniteHits
              translations={{ loadMore: t('search.loadMore') }}
              hitComponent={ENTITIES_COMPONENTS[selectedEntity]}
            />
          </Index>
        </Container>
      )}
    </MainContainer>
  )
}

export default withNamespaces('main')(connectSearchBox(SearchPage))
