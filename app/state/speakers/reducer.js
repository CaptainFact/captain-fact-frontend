import { Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'
import Speaker from './record'

export const setLoading = createAction('SPEAKERS/SET_LOADING')
export const setLoadingWiki = createAction('SPEAKERS/SET_LOADING_WIKI')
export const reset = createAction('SPEAKERS/RESET')
export const actionFetchSpeaker = createAction('SPEAKERS/FETCH_ONE')
export const actionFetchSpeakerWikiLinks = createAction('SPEAKERS/FETCH_WIKI_DATA')

const supportedSites = ['wikimedia', 'wikipedia', 'wikiquote', 'wikinews']

const INITIAL_STATE = new Record({
  currentSpeaker: new Speaker(),
  currentSpeakerSummary: '',
  currentSpeakerLinks: new Record({
    wikimedia: null,
    wikipedia: null,
    wikiquote: null,
    wikinews: null,
  })(),
  isLoading: false,
  isLoadingWiki: false,
  error: null,
})

const SpeakersReducer = handleActions(
  {
    [actionFetchSpeaker]: {
      next: (state, { payload }) => {
        return state.mergeDeep({ isLoading: false, currentSpeaker: payload })
      },
      throw: (state, { payload }) => state.merge({ isLoading: false, error: payload }),
    },
    [actionFetchSpeakerWikiLinks]: {
      next: (state, { payload }) => {
        const allLinks = {}
        for (const link of payload) {
          const siteName = checkLink(link)
          if (siteName) {
            allLinks[siteName] = link
          }
        }
        return state.mergeDeep({
          isLoadingWiki: false,
          currentSpeakerLinks: allLinks,
        })
      },
      throw: (state) => state.merge({ isLoadingWiki: false }),
    },
    [setLoading]: (state, { payload }) => state.set('isLoading', payload),
    [setLoadingWiki]: (state, { payload }) => state.set('isLoadingWiki', payload),
    [reset]: () => INITIAL_STATE(),
  },
  INITIAL_STATE()
)

function checkLink(url) {
  for (const siteName of supportedSites) {
    if (url.includes(siteName)) {
      return siteName
    }
  }
  return null
}

export default SpeakersReducer
