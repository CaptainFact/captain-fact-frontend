import reducer, { toggleSidebar } from '../reducer'

test('has correct defaults', () => {
  expect(reducer(undefined, {}).toJS()).toEqual({
    sidebarExpended: true,
    locale: 'en',
    enableAutoscroll: true,
    videosLanguageFilter: null,
    videosOnlyFromPartners: true
  })
})

test('toggle sidebar', () => {
  let state = reducer(undefined, {})

  // Expanded by default
  expect(state.sidebarExpended).toBeTruthy()

  // Collapse
  state = reducer(state, toggleSidebar())
  expect(state.sidebarExpended).toBeFalsy()

  // Expand
  state = reducer(state, toggleSidebar())
  expect(state.sidebarExpended).toBeTruthy()
})
