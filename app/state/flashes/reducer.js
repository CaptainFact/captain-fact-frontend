import { List, Record } from 'immutable'
import { handleActions, createAction, combineActions } from 'redux-actions'
import { buildFlash } from './record'
import { getErrorInfo } from '../../lib/errors'
import { NO_INTERNET_ERROR } from '../../constants'

// Actions
export const addFlash = createAction('FLASHES/ADD', options => buildFlash(options))
export const removeFlash = createAction('FLASHES/REMOVE')
export const pause = createAction('FLASHES/PAUSE', () => true)
export const unPause = createAction('FLASHES/UNPAUSE', () => false)
export const update = createAction('FLASHES/UPDATE')

// Actions helpers (use them like regular actions)
export const flashError = options => {
  return addFlash({
    flashType: 'danger',
    iconName: 'exclamation-circle',
    ...options
  })
}

export const flashErrorMsg = message => flashError({ message })

export const flashErrorUnauthenticated = () => {
  return flashError({
    message: 'errors:server.unauthenticated',
    infoText: 'main:menu.signup',
    infoUrl: '/signup'
  })
}

export const flashSuccessMsg = (message, params = {}) => {
  return addFlash({
    flashType: 'success',
    iconName: 'check-circle',
    message,
    ...params
  })
}

export function errorToFlash(msg) {
  const errorInfo = getErrorInfo(msg)
  let action = null
  if (!errorInfo) action = flashError({ message: msg, isError: true })
  else
    action = flashError({
      message: msg,
      infoUrl: errorInfo.url,
      infoText: errorInfo.i18nKey,
      isError: true
    })
  action.error = true
  return action
}

// Same as errorToFlash but doesn't show anything if payload is
// not a string (useful for forms)
export function errorMsgToFlash(msg) {
  if (typeof msg === 'string') return errorToFlash(msg)
  return () => () => null
}

// Reducer
const INITIAL_STATE = Record({
  flashes: new List(),
  isPaused: false
})

const FlashesReducer = handleActions(
  {
    [addFlash]: (state, { payload }) => {
      // Only display one error for connections problems (instead of one per request)
      if (
        payload.message === NO_INTERNET_ERROR
        && state.flashes.find(f => f.message === NO_INTERNET_ERROR)
      )
        return state
      return state.update('flashes', l => l.push(payload))
    },
    [removeFlash]: (state, { payload: { id } }) => {
      const flashIdx = state.flashes.findIndex(msg => msg.id === id)
      if (flashIdx !== -1) return state.update('flashes', l => l.delete(flashIdx))
      return state
    },
    [combineActions(pause, unPause)]: (state, { payload }) => state.set('isPaused', payload),
    [update]: (state, { payload }) => {
      if (!state.isPaused)
        return state.update('flashes', flashes => flashes
          .map(f => f.set('timeLeft', f.timeLeft - payload))
          .filter(msg => msg.timeLeft > 0)
        )
      return state
    }
  },
  INITIAL_STATE()
)

export default FlashesReducer
