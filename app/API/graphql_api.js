import ApolloClient from 'apollo-boost'
import { GRAPHQL_API_URL } from '../config'


const GraphQLClient = new ApolloClient({
  uri: GRAPHQL_API_URL
})

export default GraphQLClient
