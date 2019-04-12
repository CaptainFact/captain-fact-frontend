import wikidata from 'wikidata-sdk'
import { logWarn } from '../logger'

export const searchOnWikidata = async (search, locale) => {
  if (!search || search.length < 3) {
    return []
  }

  try {
    const language = locale || 'en'
    const url = wikidata.searchEntities({ search, language, format: 'json', limit: 10 })
    const response = await fetch(url)
    const body = await response.json()
    return body.search || []
  } catch (e) {
    logWarn(`Wikidata query failed: ${e}`)
    return []
  }
}
