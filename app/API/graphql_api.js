import ApolloClient from 'apollo-boost'
import { GRAPHQL_API_URL } from '../config'
import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from '../lib/local_storage'

const authMiddleware = operation => {
  const token = getFromLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)

  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    })
  }

  return operation
}

const GraphQLClient = new ApolloClient({
  uri: GRAPHQL_API_URL,
  request: authMiddleware
})

export default GraphQLClient
