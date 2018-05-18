import { Stack } from 'immutable'

import reducer, { addModal, popModal } from '../reducer'
import Modal from '../../../components/Modal/Modal'


const createTestModal = id => ({
  Modal,
  props: {
    id,
    hello: 'world'
  }
})

it('should return the initial state', () => {
  expect(reducer(undefined, {})).toEqual(new Stack([]))
})

it('should be able to add and remove modals', () => {
  const testModal1 = createTestModal(1)
  const testModal2 = createTestModal(2)

  let state = reducer(new Stack([]), addModal(testModal1))
  expect(state).toEqual(new Stack([testModal1]))

  state = reducer(state, addModal(testModal2))
  expect(state).toEqual(new Stack([testModal2, testModal1]))

  state = reducer(state, popModal())
  expect(state).toEqual(new Stack([testModal1]))

  state = reducer(state, popModal())
  expect(state).toEqual(new Stack([]))
})
