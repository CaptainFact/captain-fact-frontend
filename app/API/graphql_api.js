import ApolloClient from 'apollo-boost'
import { GRAPHQL_API_URL } from '../config'

const authMiddleware = operation => {
  const token = localStorage.getItem('token')

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
