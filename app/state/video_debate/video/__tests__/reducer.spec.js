import reducer, {
  fetchAll,
  setLoading,
  addSpeaker,
  removeSpeaker,
  updateSpeaker,
  setPosition,
  forcePosition,
} from '../reducer'
import fetchAllSuccess from './__fixtures__/fetch_all_success'

const INITIAL_STATE = reducer(undefined, {})

test('has correct defaults', () => {
  snapshot(INITIAL_STATE)
})

test('fetch all', () => {
  snapshotReducer(reducer, INITIAL_STATE, fetchAll(fetchAllSuccess))
})

test('set Loading', () => {
  snapshotReducer(reducer, INITIAL_STATE, setLoading(true), setLoading(false))
})

test('add speaker', () => {
  snapshotReducer(
    reducer,
    INITIAL_STATE,
    addSpeaker({
      id: 3,
      title: 'Title 3',
      full_name: 'Max Fray',
    })
  )
})

test('remove speaker', () => {
  snapshotReducer(reducer, INITIAL_STATE, removeSpeaker(3))
})

test('update speaker', () => {
  snapshotReducer(
    reducer,
    INITIAL_STATE,
    updateSpeaker({
      id: 3,
      title: 'Title 3 Update',
      full_name: 'Max Fray Update',
    })
  )
})

test('set Position', () => {
  snapshotReducer(reducer, INITIAL_STATE, setPosition({ position: 4 }))
})

test('force Position', () => {
  snapshotReducer(
    reducer,
    INITIAL_STATE,
    forcePosition({
      position: 4,
      forcedPosition: {
        requestId: 1,
        time: 0,
      },
    })
  )
})
