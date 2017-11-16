import HttpApi from '../../API/http_api'
import { setLoading, setSubmitting, setVideos } from './reducer'
import {createEffect, returnSuccess, returnError, generateFSAError} from '../utils'
import { errorToFlash } from '../flashes/reducer'


export const fetchPublicVideos = (languageFilter) => createEffect(
  HttpApi.get("videos" + (!languageFilter ? "" : `?language=${languageFilter}`)), {
    before: setLoading(true),
    after: setVideos
  }
)

export const postVideo = video => createEffect(
  HttpApi.post('videos', video), {
    before: setSubmitting(true),
    then: [setSubmitting(false), returnSuccess],
    catch: [setSubmitting(false), errorToFlash, generateFSAError]
  }
)
