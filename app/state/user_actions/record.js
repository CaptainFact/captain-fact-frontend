import { Map, Record } from 'immutable'

import User from '../users/record'

const UserAction = new Record({
  id: 0,
  user: new User(),
  type: 'unknown',
  entity: 'unknown',
  videoId: null,
  videoHashId: null,
  speakerId: null,
  statementId: null,
  commentId: null,
  changes: new Map(),
  time: new Date(),
})
export default UserAction
