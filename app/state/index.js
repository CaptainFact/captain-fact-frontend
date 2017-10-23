import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { reducer as formReducer } from 'redux-form'
import promiseMiddleware from 'redux-promise'
import thunk from 'redux-thunk'

import FlashesReducer from './flashes/reducer'
import VideoDebateReducer from './video_debate/reducer'
import CurrentUserReducer from './users/current_user/reducer'
import UserPreferencesReducer from './user_preferences/reducer'
import DisplayedUserReducer from './users/displayed_user/reducer'
import VideosReducer  from './videos/reducer'
import ModalsReducer from './modals/reducer'
import HelpReducer from './help/reducer'


// Declare reducers
const reducers = combineReducers({
  CurrentUser: CurrentUserReducer,
  DisplayedUser: DisplayedUserReducer,
  UserPreferences: UserPreferencesReducer,
  Flashes: FlashesReducer,
  Videos: VideosReducer,
  VideoDebate: VideoDebateReducer,
  Modals: ModalsReducer,
  Help: HelpReducer,
  form: formReducer
})


// Declare middlewares
const middlewares = [thunk, promiseMiddleware]


// Build store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middlewares))
)

export default store