import React from "react"
import { connect } from "react-redux"
import { hasReputation } from '../../state/users/current_user/selectors'
import { LoadingFrame } from "."
import { ErrorView } from './ErrorView'


export const ReputationGuard = ({isLoading, hasReputation, showLoading, showNotEnough, children}) => {
  if (showLoading && isLoading)
    return <LoadingFrame/>
  if (hasReputation)
    return children
  return showNotEnough ? <ErrorView error="notEnoughReputation"/> : null
}

export default connect((state, props) => ({
  hasReputation: hasReputation(state, props.requiredRep),
  isLoading: state.CurrentUser.isLoading
}))(ReputationGuard)