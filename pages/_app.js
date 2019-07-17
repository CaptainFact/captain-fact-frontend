import App, { Container } from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ThemeProvider } from 'styled-components'
import { Provider as ReduxProvider } from 'react-redux'

import withApolloClient from '../app/lib/with-apollo-client'
import theme from '../app/styles/theme'
import Layout from '../app/components/App/Layout'
import store from '../app/state'

// import '../app/styles/application.sass'

class CFApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </ReduxProvider>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApolloClient(CFApp)
