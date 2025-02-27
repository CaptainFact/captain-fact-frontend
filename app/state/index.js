import Immutable from 'immutable'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { reducer as formReducer } from 'redux-form'
import promiseMiddleware from 'redux-promise'
import thunk from 'redux-thunk'

import { JS_ENV } from '../config'
// Reducers
import HelpReducer from './help/reducer'
import ModalsReducer from './modals/reducer'
import ModerationReducer from './moderation/reducer'
import SpeakersReducer from './speakers/reducer'
import UsersActionsReducer from './user_actions/reducer'
import UserPreferencesReducer from './user_preferences/reducer'
import DisplayedUserReducer from './users/displayed_user/reducer'
import VideoDebateReducer from './video_debate/reducer'
import VideosReducer from './videos/reducer'

// Declare reducers
const reducers = combineReducers({
  DisplayedUser: DisplayedUserReducer,
  UserPreferences: UserPreferencesReducer,
  Speakers: SpeakersReducer,
  VideoDebate: VideoDebateReducer,
  Modals: ModalsReducer,
  Help: HelpReducer,
  UsersActions: UsersActionsReducer,
  Moderation: ModerationReducer,
  Videos: VideosReducer,
  form: formReducer,
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
