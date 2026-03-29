import * as AbsintheSocket from '@absinthe/socket'
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  Observable,
  split,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { print } from 'graphql'
import { Socket as PhoenixSocket } from 'phoenix'

import { GRAPHQL_API_URL } from '../config'
import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from '../lib/local_storage'

// Convert HTTP URL to WebSocket URL
const getWebSocketUrl = (httpUrl) => {
  const url = new URL(httpUrl)
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${url.host}/socket`
}

const httpLink = createHttpLink({
  uri: GRAPHQL_API_URL,
})

const authLink = setContext((_, { headers }) => {
  const token = getFromLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)
  if (token) {
    return { headers: { ...headers, authorization: `Bearer ${token}` } }
  } else {
    return { headers }
  }
})

const authedHttpLink = authLink.concat(httpLink)

// Create Phoenix socket connection
const phoenixSocket = new PhoenixSocket(getWebSocketUrl(GRAPHQL_API_URL), {
  params: () => {
    const token = getFromLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)
    if (token) {
      return { token }
    } else {
      return {}
    }
  },
})

// Wrap Phoenix socket in AbsintheSocket
const absintheSocket = AbsintheSocket.create(phoenixSocket)

// Create custom websocket link for Absinthe subscriptions
const createAbsintheLink = () => {
  return new ApolloLink((operation) => {
    const { query, variables, operationName } = operation
    const queryString = print(query)

    return new Observable((observer) => {
      const notifier = AbsintheSocket.send(absintheSocket, {
        operation: queryString,
        variables: variables || {},
        operationName: operationName,
      })

      AbsintheSocket.observe(absintheSocket, notifier, {
        onAbort: () => {
          observer.error(new Error('Subscription aborted'))
        },
        onError: (error) => {
          observer.error(error)
        },
        onStart: () => {
          // Subscription started
        },
        onResult: (result) => {
          if (result.data) {
            observer.next({ data: result.data })
          }
          if (result.errors) {
            observer.error(result.errors)
          }
        },
      })

      // Return cleanup function
      return () => {
        AbsintheSocket.cancel(absintheSocket, notifier)
      }
    })
  })
}

const websocketLink = createAbsintheLink()

// Split link: subscriptions go through websocket, queries/mutations through HTTP
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  websocketLink,
  authedHttpLink,
)

const GraphQLClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

export default GraphQLClient
