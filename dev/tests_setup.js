import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import 'isomorphic-fetch'
import 'fetch-mock'


global.React = React

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount

// Add a helper to register snapshot
global.snapshot = component => expect(shallow(component)).toMatchSnapshot()

// Configure global env variables
process.env.HTTP_API_URL = 'http://test'
