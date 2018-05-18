import { Stack } from 'immutable'
import { createAction, handleActions } from 'redux-actions'


export const addModal = createAction('ADD_MODAL')
export const popModal = createAction('POP_MODAL')

const ModalsReducer = handleActions({
  [addModal]: (state, {payload: {Modal, props}}) => state.push({Modal, props}),
  [popModal]: state => state.pop()
}, new Stack())

export default ModalsReducer
