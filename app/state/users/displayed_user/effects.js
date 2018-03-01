import HttpApi from '../../../API/http_api'
import { set as setCurrentUser } from '../current_user/reducer'
import { setLoading, setUser as setDisplayedUser } from './reducer'


export const fetchUser = username => (dispatch, getState) => {
  const isSelf = getState().CurrentUser.data.username === username

  dispatch(setLoading(true))
  return HttpApi.get(isSelf ? 'users/me' : `users/username/${username}`)
    .then(user => {
      dispatch(setDisplayedUser(user))
      dispatch(setLoading(false))
      if (isSelf)
        dispatch(setCurrentUser(user))
    }).catch(error => {
      dispatch(setDisplayedUser(error))
      dispatch(setLoading(false))
    })
}
