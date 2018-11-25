import { handleActions, createAction } from 'redux-actions'
import { Record } from 'immutable'

export const setPresence = createAction('PRESENCE/SET')
export const presenceDiff = createAction('PRESENCE/DIFF')

const INITIAL_STATE = new Record({
  viewers: new Record({ count: 0 })(),
  users: new Record({ count: 0 })()
})

const PresenceReducer = handleActions(
  {
    [setPresence]: (state, { payload }) => state.merge(payload),
    [presenceDiff]: (state, { payload: { leaves, joins } }) => {
      return state.withMutations(record =>
        record
          .updateIn(['viewers', 'count'], x => {
            return x + joins.viewers.count - leaves.viewers.count
          })
          .updateIn(['users', 'count'], x => {
            return x + joins.users.count - leaves.users.count
          })
      )
    }
  },
  INITIAL_STATE()
)

export default PresenceReducer
