import HttpApi from '../../API/http_api'
import { setLoading, setVideos, setSubmitting } from './reducer'
import { createEffect, returnSuccess, generateFSAError } from '../utils'
import { errorToFlash } from '../flashes/reducer'

/**
 * Fetch videos list
 * @param {object} filters - an object that may contains various filters:
 *  - language: A two characters code for the locale you want to filter on,
 *              'all', or 'unknown' to get untagged videos
 *  - speaker: a speaker id or slug
 */
export const fetchPublicVideos = (filters=null) => createEffect(
  HttpApi.get('videos', filters), {
    before: setLoading(true),
    after: setVideos
  }
)

export const searchVideo = videoUrl => createEffect(
  HttpApi.post('search/video', {url: videoUrl}), {
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

