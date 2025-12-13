import { toastError } from '@/lib/toasts'

import { SocketApi } from '../../API'
import { VIDEO_DEBATE_CHANNEL } from '../../constants'
import { createEffect } from '../utils'
import * as videoReducer from './video/reducer'

/**
 * Shift all video's statements
 *
 * @param {object} offsets a map of offsets
 *
 * ## Examples
 * > shiftStatements({youtube_offset: 42})
 */
export const shiftStatements = (offsets) => {
  return createEffect(SocketApi.push(VIDEO_DEBATE_CHANNEL, 'shift_statements', offsets), {
    catch: toastError,
  })
}

/** Subscribe or unsubscribe a user from given video */
export const changeSubscription = (newValue) => {
  return SocketApi.push(VIDEO_DEBATE_CHANNEL, 'change_subscription', {
    subscribed: newValue,
  })
    .then(() => {
      return videoReducer.setSubscription(newValue)
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e)
    })
}
