import React from 'react'
import { connect } from 'react-redux'

import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import { login } from '../../state/users/current_user/effects'
import { translate } from 'react-i18next'
import { isAuthenticated } from '../../state/users/current_user/selectors'


@connect(state => ({
  user: state.CurrentUser.data,
  isLoading: state.CurrentUser.isLoading || state.CurrentUser.isPosting,
  error: state.CurrentUser.error,
  isAuthenticated: isAuthenticated(state)
}), {login})
@translate('user')
export default class ThirdPartyCallback extends React.PureComponent {
  componentDidMount() {
    if (!this.props.location.query.error) {
      this.props.login({
        provider: this.props.params.provider,
        params: {
          code: this.props.location.query.code,
          invitation_token: this.props.location.query.state
        }
      })
    }
  }

  componentDidUpdate() {
    if (this.props.isAuthenticated && this.props.user.username)
      this.props.router.push(`/u/${this.props.user.username}/settings`)
  }

  render() {
    if (this.props.isLoading)
      return <LoadingFrame title="Authenticating"/>
    if (this.props.error)
      return <ErrorView error={this.props.error} i18nNS="user:errors.error"/>
    if (this.props.location.query.error)
      return <ErrorView error={this.props.location.query.error} i18nNS="user:errors.thirdParty"/>
    return <LoadingFrame title="Authenticating"/>
  }
}
