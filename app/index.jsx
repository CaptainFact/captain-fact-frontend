// Import polyfills
import { polyfill as smoothSrollPolyfill } from 'smoothscroll-polyfill'

// Import libs
import React from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

// Load store
import store from './state'

// Import APIs so they can load their configurations
import GraphQLClient from './API/graphql_api'

// Import router
import CFRouter from './router'
// Import styles
import './styles/application.sass'

// Wait for our document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('app')

  // Activate polyfills
  smoothSrollPolyfill()

  // Inject React app in DOM
  if (rootElement.hasChildNodes()) {
    hydrate(<Provider store={store}>
      <ApolloProvider client={GraphQLClient}>
        <CFRouter />
      </ApolloProvider>
    </Provider>, rootElement)
  } else {
    render(<Provider store={store}>
      <ApolloProvider client={GraphQLClient}>
        <CFRouter />
      </ApolloProvider>
    </Provider>, rootElement)
  }
})
