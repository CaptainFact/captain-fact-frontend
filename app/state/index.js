import Immutable from 'immutable'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import promiseMiddleware from 'redux-promise'
import thunk from 'redux-thunk'

import { JS_ENV } from '../config'
// Reducers
import ModalsReducer from './modals/reducer'
import ModerationReducer from './moderation/reducer'

// Declare reducers
const reducers = combineReducers({
  Modals: ModalsReducer,
  Moderation: ModerationReducer,
})

// Declare middlewares
const middlewares = [thunk, promiseMiddleware]

// If running in dev and browser has redux devtools extension activated, use it
const getComposer = () => {
  if (
    JS_ENV === 'prod' ||
    typeof window === 'undefined' ||
    !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) {
    return compose
  }
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    serialize: { immutable: Immutable },
    shouldCatchErrors: true,
  })
}

// Build store
const store = createStore(reducers, getComposer()(applyMiddleware(...middlewares)))

export default store
