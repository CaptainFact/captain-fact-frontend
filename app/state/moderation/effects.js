import HttpApi from '../../API/http_api'
import { setLoading, setSubmitting, setItems } from './reducer'
import {createEffect, returnSuccess, returnError, generateFSAError} from '../utils'
import { errorToFlash } from '../flashes/reducer'


export const fetchRandomModeration = () => createEffect(
  HttpApi.get("moderation/random"), {
    before: setLoading(true),
    after: setItems
  }
)

export const postModerationFeedback = () => createEffect(
  HttpApi.post("moderation/feedback")
)
