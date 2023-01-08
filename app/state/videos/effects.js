import HttpApi from '../../API/http_api'
import { errorToFlash } from '../flashes/reducer'
import { createEffect, generateFSAError, returnSuccess } from '../utils'
import { setSubmitting } from './reducer'

export const searchVideo = (videoUrl) => {
  return createEffect(HttpApi.post('search/video', { url: videoUrl }), {
    before: setSubmitting(true),
    then: [setSubmitting(false), returnSuccess],
    catch: [setSubmitting(false), generateFSAError],
  })
}

export const postVideo = (video) => {
  return createEffect(HttpApi.post('videos', video), {
    before: setSubmitting(true),
    then: [setSubmitting(false), returnSuccess],
    catch: [setSubmitting(false), errorToFlash, generateFSAError],
  })
}
