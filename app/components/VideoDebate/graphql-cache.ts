import { ApolloCache } from '@apollo/client'

export const removeSpeakerFromVideoCache = (cache: ApolloCache<any>, videoId: string, speakerId: string) => {
  cache.modify({
    id: cache.identify({ __typename: 'Video', id: videoId }),
    fields: {
      speakers: (existingSpeakers = [], {readField}) => existingSpeakers.filter((s) => readField('id', s) !== speakerId),
    },
  })
}