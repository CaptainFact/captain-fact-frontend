import reducer, { setSubmitting, reset } from '../reducer'

const DEFAULT_STATE = reducer(undefined, {})

test('has correct defaults', () => {
  snapshot(DEFAULT_STATE)
})

test('setSubmitting', () => {
  snapshotReducer(reducer, DEFAULT_STATE, setSubmitting(true), setSubmitting(false))
})

test('reset', () => {
  snapshotReducer(reducer, DEFAULT_STATE, reset())

  const modifiedState = reducer(DEFAULT_STATE, setSubmitting(true))
  snapshotReducer(reducer, modifiedState, reset())
})
