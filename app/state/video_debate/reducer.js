import { combineReducers } from "redux"
import PresenceReducer from './presence/reducer'

import VideoReducer from './video/reducer'
import CommentsReducer from './comments/reducer'
import StatementsReducer  from './statements/reducer'


const VideoDebateReducer = combineReducers({
  presence: PresenceReducer,
  video: VideoReducer,
  statements: StatementsReducer,
  comments: CommentsReducer
})
export default VideoDebateReducer
