// Import polyfills
import 'core-js/es6/promise'
import 'core-js/es6/symbol'
import 'core-js/es6/array'
import 'core-js/es6/string'
import 'core-js/es7/array'
import 'core-js/es7/object'
import 'core-js/modules/es6.math.trunc'

import { polyfill as smoothSrollPolyfill } from 'smoothscroll-polyfill'

// Import libs
import React from 'react'
import ReactDOM from 'react-dom'
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


// Activate polyfills
smoothSrollPolyfill()

// Inject React app in DOM
ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={GraphQLClient}>
      <CFRouter/>
    </ApolloProvider>
  </Provider>,
  document.getElementById('app')
)
