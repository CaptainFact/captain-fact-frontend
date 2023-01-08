import { combineReducers } from 'redux'

import CommentsReducer from './comments/reducer'
import PresenceReducer from './presence/reducer'
import StatementsReducer from './statements/reducer'
import VideoReducer from './video/reducer'

const VideoDebateReducer = combineReducers({
  presence: PresenceReducer,
  video: VideoReducer,
  statements: StatementsReducer,
  comments: CommentsReducer,
})
export default VideoDebateReducer
