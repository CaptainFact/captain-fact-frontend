import { combineReducers } from "redux"

import VideoReducer from './video/reducer'
import CommentsReducer from './comments/reducer'
import StatementsReducer  from './statements/reducer'


const VideoDebateReducer = combineReducers({
  video: VideoReducer,
  statements: StatementsReducer,
  comments: CommentsReducer
})
export default VideoDebateReducer
