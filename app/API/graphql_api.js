import { ApolloClient, createHttpLink,InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { GRAPHQL_API_URL } from '../config'
import { getFromLocalStorage,LOCAL_STORAGE_KEYS } from '../lib/local_storage'

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

const GraphQLClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default GraphQLClient
