import HttpApi from '../../API/http_api'
import { setLoading, setEntries } from './reducer'
import { createEffect, returnSuccess, returnError, generateFSAError } from '../utils'
import { errorToFlash } from '../flashes/reducer'


export const fetchRandomModeration = (languageFilter) => createEffect(
  HttpApi.get("moderation/random"), {
    before: setLoading(true),
    after: setEntries
  }
)
