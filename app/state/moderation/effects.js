import HttpApi from '../../API/http_api'
import { setLoading, setSubmitting, setEntries } from './reducer'
import {createEffect, returnSuccess, returnError, generateFSAError} from '../utils'
import { errorToFlash } from '../flashes/reducer'


export const fetchRandomModeration = () => createEffect(
  HttpApi.get("moderation/random"), {
    before: setLoading(true),
    after: setEntries
  }
)
