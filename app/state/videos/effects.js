import HttpApi from '../../API/http_api'
import { setSubmitting } from './reducer'
import { createEffect, returnSuccess, generateFSAError } from '../utils'
import { errorToFlash } from '../flashes/reducer'

export const searchVideo = videoUrl => createEffect(
  HttpApi.post('search/video', { url: videoUrl }), {
    before: setSubmitting(true),
    then: [setSubmitting(false), returnSuccess],
    catch: [setSubmitting(false), generateFSAError]
  }
)

export const postVideo = video => createEffect(
  HttpApi.post('videos', video), {
    before: setSubmitting(true),
    then: [setSubmitting(false), returnSuccess],
    catch: [setSubmitting(false), errorToFlash, generateFSAError]
  }
)
