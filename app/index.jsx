// Import polyfills
import { polyfill as smoothSrollPolyfill } from 'smoothscroll-polyfill'

// Import libs
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { ThemeProvider } from 'styled-components'
import { I18nextProvider } from 'react-i18next'

// Load store
import store from './state'

// Import APIs so they can load their configurations
import GraphQLClient from './API/graphql_api'
import i18n from './i18n/i18n'

// Import router
import CFRouter from './router'

// Import styles
import './styles/application.sass'
import theme from './styles/theme'
import UserProvider from './components/LoggedInUser/UserProvider'

// Activate polyfills
smoothSrollPolyfill()

// Inject React app in DOM
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ReduxProvider store={store}>
      <ApolloProvider client={GraphQLClient}>
        <I18nextProvider i18n={i18n}>
          <UserProvider>
            <CFRouter />
          </UserProvider>
        </I18nextProvider>
      </ApolloProvider>
    </ReduxProvider>
  </ThemeProvider>,
  document.getElementById('app')
)
