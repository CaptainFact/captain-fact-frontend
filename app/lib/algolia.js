import Algolia from 'algoliasearch/lite'

import { ALGOLIA_APP_ID, ALGOLIA_USAGE_API_KEY, JS_ENV } from '../config'
import { ENTITY_SPEAKER, ENTITY_STATEMENT, ENTITY_VIDEO } from '../constants'

export const ALGOLIA_INDEXES_NAMES = {
  [ENTITY_VIDEO]: `${JS_ENV}_videos`,
  [ENTITY_SPEAKER]: `${JS_ENV}_speakers`,
  [ENTITY_STATEMENT]: `${JS_ENV}_statements`,
}

const algoliaClient = Algolia(ALGOLIA_APP_ID, ALGOLIA_USAGE_API_KEY)

export const searchClient = {
  search(requests) {
    const filteredRequests = requests.filter((request) => Boolean(request.params.query)) // Remove empty queries
    if (filteredRequests.length) {
      return algoliaClient.search(filteredRequests)
    }
  },
}
