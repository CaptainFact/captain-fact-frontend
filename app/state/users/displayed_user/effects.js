import HttpApi from '../../../API/http_api'
import { setLoading, setUser } from './reducer'


export const fetchUser = username => (dispatch, getState) => {
  let userEndpoint = ''
  if (getState().CurrentUser.data.username === username)
    userEndpoint = 'users/me'
  else
    userEndpoint = `users/username/${username}`
  dispatch(setLoading(true))
  return dispatch(setUser(HttpApi.get(userEndpoint)))
}
