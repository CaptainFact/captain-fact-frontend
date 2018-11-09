// Import polyfills
import { polyfill as smoothSrollPolyfill } from 'smoothscroll-polyfill'

// Import libs
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { Provider as FelaProvider } from "react-fela"
import { render as renderDynamicStyles } from "fela-dom"

// Load store
import store from './state'

// Import APIs so they can load their configurations
import GraphQLClient from './API/graphql_api'

// Import router
import CFRouter from './router'

// Import styles
import './styles/application.sass'
import "./styles/index.css"
import createRenderer from "./styles" // fela renderer (css in js)

// Activate polyfills
smoothSrollPolyfill()

const stylesRenderer = createRenderer()
// renderDynamicStyles(stylesRenderer)

// Inject React app in DOM
ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={GraphQLClient}>
      <FelaProvider renderer={renderDynamicStyles(stylesRenderer)}>
        <CFRouter />
      </FelaProvider>
    </ApolloProvider>
  </Provider>,
  document.getElementById('app')
)
