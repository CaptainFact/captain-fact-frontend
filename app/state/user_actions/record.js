import { Record, Map } from 'immutable'
import User from '../users/record'

const UserAction = new Record({
  id: 0,
  user: new User(),
  type: 0,
  entity: 0,
  videoId: null,
  videoHashId: null,
  speakerId: null,
  statementId: null,
  commentId: null,
  changes: new Map(),
  time: new Date()
})
export default UserAction
