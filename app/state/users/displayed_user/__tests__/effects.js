import fetchMock from 'fetch-mock'
import { fetchUser } from '../effects'
import { set as setCurrentUser } from '../../current_user/reducer'
import { setLoading, setUser as setDisplayedUser } from '../reducer'
import User from '../../record'


// Prepare test data
const self = new User({id: 42, username: "IamMe"})
const other = new User({id: 55, username: "OtherUser"})
fetchMock.get('http://test/users/me', self)
fetchMock.get(`http://test/users/username/${other.username}`, other.toJS())


test('fetch other user', () => {
  const dispatchMock = jest.fn()
  const getStateMock = () => ({CurrentUser: {data: {username: self.username}}})

  fetchMock.reset()
  fetchUser(other.username)(dispatchMock, getStateMock).then(() => {
    // Start by dispatching isLoading
    expect(dispatchMock.mock.calls[0][0]).toEqual(setLoading(true))

    // Set displayed user
    expect(dispatchMock.mock.calls[1][0]).toEqual(setDisplayedUser(other.toJS()))

    // Reset isLoading
    expect(dispatchMock.mock.calls[2][0]).toEqual(setLoading(false))

    // There are no other dispatch
    expect(dispatchMock.mock.calls.length).toEqual(3)
  })
})

test('fetch self', () => {
  const dispatchMock = jest.fn()
  const getStateMock = () => ({CurrentUser: {data: {username: self.username}}})

  fetchMock.reset()
  fetchUser(self.username)(dispatchMock, getStateMock).then(() => {
    // Start by dispatching isLoading
    expect(dispatchMock.mock.calls[0][0]).toEqual(setLoading(true))

    // Set displayed user
    expect(dispatchMock.mock.calls[1][0]).toEqual(setDisplayedUser(self.toJS()))

    // Reset isLoading
    expect(dispatchMock.mock.calls[2][0]).toEqual(setLoading(false))

    // Update self
    expect(dispatchMock.mock.calls[3][0]).toEqual(setCurrentUser(self.toJS()))

    // There are no other dispatch
    expect(dispatchMock.mock.calls.length).toEqual(4)
  })
})