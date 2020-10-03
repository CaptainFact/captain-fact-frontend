import React from 'react'

import { withNamespaces } from 'react-i18next'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { signIn } from '../../API/http_api/current_user'

@withNamespaces('user')
@withLoggedInUser
export default class ThirdPartyCallback extends React.PureComponent {
  state = { error: null }

  componentDidMount() {
    if (!this.props.location.query.error) {
      signIn(this.props.params.provider, {
        code: this.props.location.query.code,
        invitation_token: this.props.location.query.state,
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
      this.props.router.push(`/u/${this.props.loggedInUser.username}/settings`)
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorView error={this.props.error} i18nNS="user:errors.error" />
    }
    if (this.props.location.query.error) {
      return <ErrorView error={this.props.location.query.error} i18nNS="user:errors.thirdParty" />
    }
    return <LoadingFrame title="Authenticating" />
  }
}
