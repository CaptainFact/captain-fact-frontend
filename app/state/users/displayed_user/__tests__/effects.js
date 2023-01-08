import fetchMock from 'fetch-mock'

import User from '../../record'
import { fetchUser } from '../effects'
import { setLoading, setUser as setDisplayedUser } from '../reducer'

// Prepare test data
const self = new User({ id: 42, username: 'IamMe' })
const other = new User({ id: 55, username: 'OtherUser' })

test('fetch other user', () => {
  const dispatchMock = jest.fn()
  const getStateMock = () => ({})

  fetchMock.get('http://test/users/me', self)
  fetchMock.get(`http://test/users/username/${other.username}`, other.toJS())
  fetchUser(other.username)(dispatchMock, getStateMock).then(() => {
    // Start by dispatching isLoading
    expect(dispatchMock.mock.calls[0][0]).toEqual(setLoading(true))

    // Set displayed user
    expect(dispatchMock.mock.calls[1][0]).toEqual(setDisplayedUser(other.toJS()))

    // There are no other dispatch
    expect(dispatchMock.mock.calls.length).toEqual(2)

    fetchMock.reset()
  })
})
