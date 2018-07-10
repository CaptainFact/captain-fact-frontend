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
  expect(reducer(undefined, {})).toMatchSnapshot()
})

it('should be able to add and remove modals', () => {
  const testModal1 = createTestModal(1)
  const testModal2 = createTestModal(2)

  let state = reducer(new Stack([]), addModal(testModal1))
  expect(state).toMatchSnapshot()

  state = reducer(state, addModal(testModal2))
  expect(state).toMatchSnapshot()

  state = reducer(state, popModal())
  expect(state).toMatchSnapshot()

  state = reducer(state, popModal())
  expect(state).toMatchSnapshot()
})
