import reducer, { addFlag, fetchAll } from '../reducer'
import fetchAllSuccess from './__fixtures__/fetch_all_success'

const INITIAL_STATE = reducer(undefined, {})

test('has correct defaults', () => {
  snapshot(INITIAL_STATE)
})

test('fetch all', () => {
  snapshotReducer(reducer, INITIAL_STATE, fetchAll(fetchAllSuccess))
})

test('add flag', () => {
  snapshotReducer(reducer, INITIAL_STATE, addFlag(42), addFlag(43), addFlag(44))
})
