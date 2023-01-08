import HttpApi from '../../../API/http_api'
import {
  setError as setDisplayedUserError,
  setLoading,
  setUser as setDisplayedUser,
} from './reducer'

export const fetchUser = (username) => (dispatch) => {
  dispatch(setLoading(true))
  return HttpApi.get(`users/username/${username}`)
    .then((user) => {
      dispatch(setDisplayedUser(user))
    })
    .catch((error) => {
      dispatch(setDisplayedUserError(error))
    })
}
