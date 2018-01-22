import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'
import { isAuthenticated, hasReputation } from '../state/users/current_user/selectors'
import { LoadingFrame, LinkWithIcon } from "./Utils"

@connect((state, props) => ({
  isAuthenticated: isAuthenticated(state),
  hasReputation: hasReputation(state, props.requiredRep),
  isLoading: state.CurrentUser.isLoading
}))
@translate('errors')
export default class ReputationGuard extends React.PureComponent {
  render() {
    const { isLoading, hasReputation, t } = this.props

    if (isLoading)
      return <LoadingFrame/>
    if (hasReputation)
      return this.props.children
    return <div>{ t('client.notEnoughReputation') }</div>
    }
}