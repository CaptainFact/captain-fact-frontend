import React from 'react'
import { withNamespaces } from 'react-i18next'

import { signIn } from '../../API/http_api/current_user'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'

@withNamespaces('user')
@withLoggedInUser
export default class ThirdPartyCallback extends React.PureComponent {
  state = { error: null }

  componentDidMount() {
    const searchParams = new URLSearchParams(location.search)
    if (!searchParams.has('error')) {
      signIn(this.props.match.params.provider, {
        code: searchParams.get('code'),
        invitation_token: searchParams.get('state'),
      })
        .then(({ user, token }) => {
          this.props.updateLoggedInUser(user, token)
        })
        .catch((e) => {
          this.setState({ error: e })
        })
    }
  }

  componentDidUpdate() {
    if (this.props.isAuthenticated && this.props.loggedInUser.username) {
      this.props.history.push(`/u/${this.props.loggedInUser.username}/settings`)
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorView error={this.props.error} i18nNS="user:errors.error" />
    }
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.has('error')) {
      return <ErrorView error={searchParams.get('error')} i18nNS="user:errors.thirdParty" />
    }
    return <LoadingFrame title="Authenticating" />
  }
}
