import React from "react"
import { connect } from "react-redux"
import { hasReputation } from '../../state/users/current_user/selectors'
import { LoadingFrame } from "."
import { ErrorView } from './ErrorView'


export const ReputationGuard = ({
  isLoading, hasReputation, showLoading, showNotEnough, children, user,
  verifyFunc=null
}) => {
  if (showLoading && isLoading)
    return <LoadingFrame/>
  if (verifyFunc ? verifyFunc(user, hasReputation) : hasReputation)
    return children
  return showNotEnough ? <ErrorView error="notEnoughReputation"/> : null
}

export default connect((state, props) => ({
  hasReputation: hasReputation(state, props.requiredRep),
  user: state.CurrentUser.data,
  isLoading: state.CurrentUser.isLoading
}))(ReputationGuard)