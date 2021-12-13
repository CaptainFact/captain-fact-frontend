import { configureStore } from '@reduxjs/toolkit'
import { reducer as formReducer } from 'redux-form'
import promiseMiddleware from 'redux-promise'

// Reducers
import FlashesReducer from './flashes/reducer'
import VideoDebateReducer from './video_debate/reducer'
import UserPreferencesReducer from './user_preferences/reducer'
import DisplayedUserReducer from './users/displayed_user/reducer'
import ModalsReducer from './modals/reducer'
import HelpReducer from './help/reducer'
import UsersActionsReducer from './user_actions/reducer'
import SpeakersReducer from './speakers/reducer'
import ModerationReducer from './moderation/reducer'
import VideosReducer from './videos/reducer'

// Declare reducers
const reducers = {
  DisplayedUser: DisplayedUserReducer,
  UserPreferences: UserPreferencesReducer,
  Flashes: FlashesReducer,
  Speakers: SpeakersReducer,
  VideoDebate: VideoDebateReducer,
  Modals: ModalsReducer,
  Help: HelpReducer,
  UsersActions: UsersActionsReducer,
  Moderation: ModerationReducer,
  Videos: VideosReducer,
  form: formReducer,
}

// Declare middlewares
const middlewares = [promiseMiddleware]

// Build store

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
})

export default store
