import { toastError } from '@/lib/toasts'

import HttpApi from '../../API/http_api'
import { createEffect } from '../utils'
import { removeModerationEntry, setLoading, setModerationEntry } from './reducer'

export const fetchRandomModeration = () => {
  return createEffect(HttpApi.get('moderation/random'), {
    before: setLoading(true),
    after: setModerationEntry,
  })
}

export const postModerationFeedback = (values) => {
  return createEffect(HttpApi.post('moderation/feedback', values), {
    then: removeModerationEntry,
    catch: toastError,
  })
}
