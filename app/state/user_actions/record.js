import { Record, Map } from "immutable"
import User from '../users/record'

const UserAction = new Record({
  id: 0,
  user: new User(),
  context: null,
  type: 0,
  entity: 0,
  entity_id: 0,
  changes: new Map(),
  time: new Date()
})
export default UserAction
