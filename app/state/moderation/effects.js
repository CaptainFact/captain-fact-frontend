import HttpApi from '../../API/http_api'
import { errorToFlash } from '../flashes/reducer'
import { setLoading, setModerationEntry, removeModerationEntry } from './reducer'
import { createEffect } from '../utils'

export const fetchRandomModeration = () => {
  return createEffect(HttpApi.get('moderation/random'), {
    before: setLoading(true),
    after: setModerationEntry
  })
}

export const postModerationFeedback = values => {
  return createEffect(HttpApi.post('moderation/feedback', values), {
    then: removeModerationEntry,
    catch: errorToFlash
  })
}
