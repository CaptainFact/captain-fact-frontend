import reducer, { addModal, popModal } from '../reducer'
import Modal from '../../../components/Modal/Modal'

const INITIAL_STATE = reducer(undefined, {})

const createTestModal = (id) => ({
  Modal,
  props: {
    id,
    hello: 'world',
  },
})

it('should return the initial state', () => {
  snapshot(INITIAL_STATE)
})

it('should be able to add and remove modals', () => {
  snapshotReducer(
    reducer,
    INITIAL_STATE,
    addModal(createTestModal(1)),
    addModal(createTestModal(2)),
    popModal(),
    popModal()
  )
})
