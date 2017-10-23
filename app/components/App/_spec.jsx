// import React from 'react'
// import expect from 'expect'
// import { shallow, mount } from 'enzyme'
//
// import { App } from './App'
//
// const props = {}
//
// describe('<App />', () => {
//   it('should render', () => {
//     const renderedComponent = shallow(
//       <App {...props} />
//     )
//     expect(renderedComponent.is('div')).toEqual(true)
//   })
//   it('calls dispatch on componentDidMount', () => {
//     const spy = expect.createSpy()
//     const renderedComponent = mount(
//       <App dispatch={spy} />
//     )
//     expect(spy).toHaveBeenCalled()
//   })
//   it('calls dispatch with UserActions.auth', () => {
//     const spy = expect.createSpy()
//     const renderedComponent = mount(
//       <App dispatch={spy} />
//     )
//     expect(spy).toHaveBeenCalledWith(UserActions.auth())
//   })
// })
