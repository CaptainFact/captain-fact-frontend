import HttpApi from '../../API/http_api'
import { setLoading, setItems, removeItem } from './reducer'
import { createEffect } from '../utils'


export const fetchRandomModeration = () => createEffect(
  HttpApi.get("moderation/random"), {
    before: setLoading(true),
    after: setItems
  }
)

export const postModerationFeedback = (entryId, action) => createEffect(
  HttpApi.post("moderation/feedback", {
    "value": action,
    "action_id": entryId
  }), {
    after: removeItem(entryId)
  }
)
