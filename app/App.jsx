// Import polyfills
// Import styles
import '@/styles/main.css'

import { ApolloProvider } from '@apollo/client'
// Import libs
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { Configure, Index, InstantSearch } from 'react-instantsearch-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { polyfill as smoothScrollPolyfill } from 'smoothscroll-polyfill'
import { ThemeProvider } from 'styled-components'

// Import APIs so they can load their configurations
import GraphQLClient from './API/graphql_api'
import UserProvider from './components/LoggedInUser/UserProvider'
import { ToastProvider } from './components/ui/toast'
import { TooltipProvider } from './components/ui/tooltip'
import { ENTITY_SPEAKER, ENTITY_STATEMENT, ENTITY_VIDEO } from './constants'
import i18n from './i18n/i18n'
import { ALGOLIA_INDEXES_NAMES, searchClient } from './lib/algolia'
// Import router
import CFRouter from './router'
// Load store
import store from './state'
import theme from './styles/theme'

// Activate polyfills
smoothScrollPolyfill()

const App = () => (
  <ToastProvider>
    <ThemeProvider theme={theme}>
      <ReduxProvider store={store}>
        <ApolloProvider client={GraphQLClient}>
          <I18nextProvider i18n={i18n}>
            <TooltipProvider>
              <UserProvider>
                <InstantSearch
                  searchClient={searchClient}
                  indexName={ALGOLIA_INDEXES_NAMES[ENTITY_VIDEO]}
                >
                  <Index indexName={ALGOLIA_INDEXES_NAMES[ENTITY_VIDEO]}>
                    <Configure hitsPerPage={16} />
                  </Index>
                  <Index indexName={ALGOLIA_INDEXES_NAMES[ENTITY_SPEAKER]}>
                    <Configure hitsPerPage={32} />
                  </Index>
                  <Index indexName={ALGOLIA_INDEXES_NAMES[ENTITY_STATEMENT]}>
                    <Configure hitsPerPage={24} />
                  </Index>
                  <CFRouter />
                </InstantSearch>
              </UserProvider>
            </TooltipProvider>
          </I18nextProvider>
        </ApolloProvider>
      </ReduxProvider>
    </ThemeProvider>
  </ToastProvider>
)

export default App
