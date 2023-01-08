import reducer, { closeSidebar, toggleSidebar } from '../reducer'

const INITIAL_STATE = reducer(undefined, {})

test('has correct defaults', () => {
  snapshot(INITIAL_STATE)
})

test('toggle sidebar', () => {
  let state = INITIAL_STATE

  // Expanded by default
  expect(state.sidebarExpended).toBeTruthy()

  // Collapse
  state = reducer(state, toggleSidebar())
  expect(state.sidebarExpended).toBeFalsy()

  // Expand
  state = reducer(state, toggleSidebar())
  expect(state.sidebarExpended).toBeTruthy()
})

test('close sidebar', () => {
  expect(reducer(INITIAL_STATE, closeSidebar()).sidebarExpended).toBeFalsy()
})
