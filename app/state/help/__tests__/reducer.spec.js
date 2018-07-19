import reducer, { setLoading, reset } from '../reducer'

const INITIAL_STATE = reducer(undefined, {})

it('should return the initial state', () => {
  snapshot(INITIAL_STATE)
})

it('setLoading', () => {
  snapshotReducer(reducer, INITIAL_STATE, setLoading(true), setLoading(false))
})

it('reset', () => {
  snapshotReducer(reducer, INITIAL_STATE, setLoading(true), reset())
})
