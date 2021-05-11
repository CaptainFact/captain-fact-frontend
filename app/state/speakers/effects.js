import HttpApi from '../../API/http_api'
import {
  actionFetchSpeaker,
  actionFetchSpeakerWikiLinks,
  setLoading,
  setLoadingWiki,
} from './reducer'
import { createEffect } from '../utils'

export const fetchSpeaker = (slugOrId) =>
  createEffect(HttpApi.get(`speakers/${slugOrId}`), {
    before: setLoading(true),
    after: actionFetchSpeaker,
  })

export const fetchWikiDataInfo =
  (wikidataId, locale = 'en') =>
  (dispatch) => {
    dispatch(setLoadingWiki(true))
    const url = `https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=SELECT%20%3Fsitelink%20WHERE%20%7B%0A%20%20BIND(wd%3A${wikidataId}%20AS%20%3Fperson)%0A%20%20%3Fsitelink%20schema%3Aabout%20%3Fperson%20.%20%3Fsitelink%20schema%3AinLanguage%20%22${locale}%22%0A%7D`
    return fetch(url).then((r) =>
      r.text().then((xml) => {
        const parser = new DOMParser()
        const res = parser.parseFromString(xml, 'text/xml')
        const links = Array.from(res.getElementsByTagName('uri')).map((e) => e.textContent)
        return dispatch(actionFetchSpeakerWikiLinks(links))
      })
    )
  }
