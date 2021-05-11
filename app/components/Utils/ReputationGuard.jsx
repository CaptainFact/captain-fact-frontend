import React from 'react'
import PropTypes from 'prop-types'

import { LoadingFrame } from './LoadingFrame'
import { ErrorView } from './ErrorView'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

export const DumbReputationGuard = ({
  loggedInUser,
  loggedInUserLoading,
  checkReputation,
  requiredRep,
  showLoading,
  showNotEnough,
  children,
  verifyFunc = null,
}) => {
  if (showLoading && loggedInUserLoading) {
    return <LoadingFrame />
  }

  const hasReputation = checkReputation(requiredRep)
  if (verifyFunc ? verifyFunc(loggedInUser, hasReputation) : hasReputation) {
    return children
  }

  return showNotEnough ? <ErrorView error="notEnoughReputation" /> : null
}

const ReputationGuard = withLoggedInUser(DumbReputationGuard)

ReputationGuard.propTypes = {
  requiredRep: PropTypes.number.isRequired,
  showLoading: PropTypes.bool,
  showNotEnough: PropTypes.bool,
  verifyFunc: PropTypes.func,
}

export const withReputationGuard =
  (requiredRep, showLoading = true, showNotEnough = true, props = {}) =>
  (WrappedComponent) =>
  (wrappedComponentProps) =>
    (
      <ReputationGuard
        requiredRep={requiredRep}
        showLoading={showLoading}
        showNotEnough={showNotEnough}
        {...props}
      >
        <WrappedComponent {...wrappedComponentProps} />
      </ReputationGuard>
    )

export default ReputationGuard
