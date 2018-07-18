import reducer, {
  setLoading,
  setSubmitting,
  reset,
  setVideos
} from '../reducer'
import mockedVideosList from './__fixtures__/videos'

const DEFAULT_STATE = reducer(undefined, {})

test('has correct defaults', () => {
  snapshot(DEFAULT_STATE)
})

test('setSubmitting', () => {
  snapshotReducer(reducer, DEFAULT_STATE,
    setSubmitting(true),
    setSubmitting(false)
  )
})

test('setLoading', () => {
  snapshotReducer(reducer, DEFAULT_STATE,
    setLoading(true),
    setLoading(false)
  )
})

test('reset', () => {
  snapshotReducer(reducer, DEFAULT_STATE, reset())

  const modifiedState = reducer(DEFAULT_STATE, setSubmitting(true))
  snapshotReducer(reducer, modifiedState, reset())
})

test('setVideos', () => {
  snapshotReducer(reducer, DEFAULT_STATE, setVideos(mockedVideosList))
})
