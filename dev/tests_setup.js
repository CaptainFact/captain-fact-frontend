/**
 * render: lets us render the component as React would
 * screen: a utility for finding elements the same way the user does
 */
import renderer from 'react-test-renderer'
import React from 'react'
import 'isomorphic-fetch'
import 'fetch-mock'

global.React = React

// Configure global env variables
process.env.HTTP_API_URL = 'http://test'
process.env.INVITATION_SYSTEM = 'off'

// Add a helper to register snapshot
global.snapshot = (element) => expect(element).toMatchSnapshot()

// Shallow then snapshot component
global.snapshotComponent = (component) => snapshot(renderer.create(component).toJSON())

/**
 * Apply all actions to given reducer and make a snapshot at each step.
 */
global.snapshotReducer = (reducer, initialState, ...actions) => {
  snapshot(initialState)
  return actions.reduce((state, action) => {
    const newState = reducer(state, action)
    snapshot(newState)
    return newState
  }, initialState)
}

const mockWithNamespaces = () => (Component) => {
  Component.defaultProps = {
    ...Component.defaultProps,
    t: (str) => `Translated[${str}]`,
  }
  return Component
}

/**
 * This mock makes sure any components using the translate HoC
 * receive the t function as a prop
 */
jest.mock('react-i18next', () => ({
  Interpolate: ({ i18nKey, ...props }) =>
    `Interpolated[${i18nKey}] with props ${JSON.stringify(props)}`,
  Trans: ({ i18nKey, ...props }) => `Trans[${i18nKey}] with props ${JSON.stringify(props)}`,
  translate: mockWithNamespaces,
  withNamespaces: mockWithNamespaces,
  t: (str) => `Translated[${str}]`,
}))

/**
 * Mock the uuid module
 */
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'A-UNIQUE-UUID'),
}))
