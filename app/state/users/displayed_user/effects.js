import HttpApi from '../../../API/http_api'
import {
  setLoading,
  setUser as setDisplayedUser,
  setError as setDisplayedUserError
} from './reducer'

export const fetchUser = username => dispatch => {
  dispatch(setLoading(true))
  return HttpApi.get(`users/username/${username}`)
    .then(user => {
      dispatch(setDisplayedUser(user))
    })
    .catch(error => {
      dispatch(setDisplayedUserError(error))
    })
}
