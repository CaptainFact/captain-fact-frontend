import HttpApi from '../../../API/http_api'
import { setLoading, setUser } from './reducer'


export const fetchUser = username => (dispatch, getState) => {
  if (getState().CurrentUser.data.username === username)
    username = 'me'
  dispatch(setLoading(true))
  return dispatch(setUser(HttpApi.get(`users/${username}`)))
}
