import React from "react"
import { connect } from 'react-redux'

import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import { login } from '../../state/users/current_user/effects'
import { translate } from 'react-i18next'


@connect(state => ({
  user: state.CurrentUser.data,
  isLoading: state.CurrentUser.isLoading,
  error: state.CurrentUser.error
}), {login})
@translate('user')
export default class ThirdPartyCallback extends React.PureComponent {
  componentDidMount() {
    if (!this.props.location.query.error) {
      this.props.login({
        provider: this.props.params.provider,
        params: this.props.location.query
      })
    }
  }

  componentWillReceiveProps(props) {
    // TODO If user is authenticated, redirect somewhere else
    if (props.user.id)
      this.props.router.push(`/u/${props.user.username}/settings`)
  }

  render() {
    if (this.props.isLoading)
      return <LoadingFrame title="Authenticating"/>
    if (this.props.error)
      return <ErrorView error={this.props.error} i18nNS="user:errors.error"/>
    if (this.props.location.query.error)
      return <ErrorView error={this.props.location.query.error} i18nNS="user:errors.thirdParty"/>
    return null
  }
}
