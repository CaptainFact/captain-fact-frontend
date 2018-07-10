import reducer, { setLoading, reset } from '../reducer'

const INITIAL_STATE = reducer(undefined, {})

it('should return the initial state', () => {
  expect(INITIAL_STATE).toMatchSnapshot()
})

it('setLoading', () => {
  expect(reducer(INITIAL_STATE, setLoading(true))).toMatchSnapshot()
  expect(reducer(INITIAL_STATE, setLoading(false))).toMatchSnapshot()
})

it('reset', () => {
  const modifiedState = reducer(INITIAL_STATE, setLoading(true))
  expect(reducer(modifiedState, reset())).toMatchSnapshot()
})
