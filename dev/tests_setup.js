import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import 'isomorphic-fetch'
import 'fetch-mock'


global.React = React

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

// Configure global env variables
process.env.HTTP_API_URL = 'http://test'
process.env.INVITATION_SYSTEM = 'off'

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount

// Add a helper to register snapshot
global.snapshot = element => expect(element).toMatchSnapshot()

// Shallow then snapshot component
global.snapshotComponent = component => snapshot(shallow(component))

/**
 * Apply all actions to given reducer and make a snapshot at each step.
 */
global.snapshotReducer = ((reducer, initialState, ...actions) => {
  snapshot(initialState)
  return actions.reduce((state, action) => {
    const newState = reducer(state, action)
    snapshot(newState)
    return newState
  }, initialState)
})

const mockWithNamespaces = () => Component => {
  Component.defaultProps = {
    ...Component.defaultProps,
    t: str => `Translated[${str}]`
  }
  return Component
}

/**
 * This mock makes sure any components using the translate HoC
 * receive the t function as a prop
 */
jest.mock('react-i18next', () => ({
  Interpolate: ({ i18nKey, ...props }) => (
    `Interpolated[${i18nKey}] with props ${JSON.stringify(props)}`
  ),
  Trans: ({ i18nKey, ...props }) => (
    `Trans[${i18nKey}] with props ${JSON.stringify(props)}`
  ),
  translate: mockWithNamespaces,
  withNamespaces: mockWithNamespaces,
  t: str => `Translated[${str}]`
}))

/**
 * Mock the uuid module
 */
jest.mock('uuid/v1', () => jest.fn(() => 'A-UNIQUE-UUID'))
