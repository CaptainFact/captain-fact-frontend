// Used only to show a message when request fail / timeout due to connection problems
import { NO_INTERNET_ERROR } from '../constants'
import { flashError } from '../state/flashes/reducer'
import store from '../state/index'

export default function noInternetError() {
  store.dispatch(
    flashError({
      message: NO_INTERNET_ERROR,
      timeLeft: 999999999999,
      infoText: 'actions.reload',
    }),
  )
}
