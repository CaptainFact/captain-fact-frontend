import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { reducer as formReducer } from 'redux-form'
import Immutable from 'immutable'
import promiseMiddleware from 'redux-promise'
import thunk from 'redux-thunk'

import { JS_ENV } from '../config'

// Reducers
import FlashesReducer from './flashes/reducer'
import VideoDebateReducer from './video_debate/reducer'
import CurrentUserReducer from './users/current_user/reducer'
import UserPreferencesReducer from './user_preferences/reducer'
import DisplayedUserReducer from './users/displayed_user/reducer'
import VideosReducer  from './videos/reducer'
import ModalsReducer from './modals/reducer'
import HelpReducer from './help/reducer'
import UsersActionsReducer from './user_actions/reducer'
import SpeakersReducer from './speakers/reducer'
import ModerationReducer from './moderation/reducer'

// Declare reducers
const reducers = combineReducers({
  CurrentUser: CurrentUserReducer,
  DisplayedUser: DisplayedUserReducer,
  UserPreferences: UserPreferencesReducer,
  Flashes: FlashesReducer,
  Videos: VideosReducer,
  Speakers: SpeakersReducer,
  VideoDebate: VideoDebateReducer,
  Modals: ModalsReducer,
  Help: HelpReducer,
  UsersActions: UsersActionsReducer,
  Moderation: ModerationReducer,
  form: formReducer
})


// Declare middlewares
const middlewares = [thunk, promiseMiddleware]

// If running in dev and browser has redux devtools extension activated, use it
const getComposer = () => {
  if (JS_ENV === 'prod' || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    return compose
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    serialize: {immutable: Immutable},
    shouldCatchErrors: true
  })
}

// Build store
const store = createStore(reducers, getComposer()(applyMiddleware(...middlewares)))

export default store
