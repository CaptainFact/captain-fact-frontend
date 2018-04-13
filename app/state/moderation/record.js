import { Record, List } from 'immutable'
import UserAction from '../user_actions/record'

const ModerationEntry = new Record({
  action: UserAction(),
  flags: new List()
})

export default ModerationEntry