import gql from 'graphql-tag'

export const VideosQuery = gql`
  query VideosIndex($offset: Int! = 1, $limit: Int! = 16, $filters: VideoFilter = {}) {
    videos(limit: $limit, offset: $offset, filters: $filters) {
      pageNumber
      totalPages
      entries {
        hash_id: hashId
        provider_id: providerId
        provider
        title
        insertedAt
        isPartner
        speakers {
          full_name: fullName
          id
          slug
        }
      }
    }
  }
`
