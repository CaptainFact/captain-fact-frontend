import Algolia from 'algoliasearch/lite'
import { ENTITY_SPEAKER, ENTITY_STATEMENT, ENTITY_VIDEO } from '../constants'
import { ALGOLIA_APP_ID, ALGOLIA_USAGE_API_KEY, JS_ENV } from '../config'

export const ALGOLIA_INDEXES_NAMES = {
  [ENTITY_VIDEO]: `${JS_ENV}_videos`,
  [ENTITY_SPEAKER]: `${JS_ENV}_speakers`,
  [ENTITY_STATEMENT]: `${JS_ENV}_statements`,
}

export const searchClient = Algolia(ALGOLIA_APP_ID, ALGOLIA_USAGE_API_KEY)
