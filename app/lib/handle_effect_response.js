import { SubmissionError } from 'redux-form'
import { Record } from 'immutable'

export const handleEffectResponse =
  ({ onSuccess, onError }) =>
  (action) => {
    if (action) {
      if (onError && action.error) {
        onError(action.payload)
      } else if (onSuccess && !action.error) {
        onSuccess(action.payload)
      }
    }
    return action
  }

/**
 * Same as `handleEffectResponse` but throws a SubmissionError
 * after calling `onError`.
 *
 * @param handlers {{onSuccess, onError}}
 */
export const handleFormEffectResponse =
  (handlers = {}) =>
  (action) => {
    const { onSuccess, onError } = handlers
    if (action) {
      if (action.error) {
        if (onError) {
          onError(action.payload)
        }
        if (typeof action.payload === 'object' && !(action.payload instanceof Record)) {
          throw new SubmissionError(action.payload)
        }
      } else if (onSuccess) {
        onSuccess(action.payload)
      }
    }
    return action
  }
