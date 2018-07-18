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
