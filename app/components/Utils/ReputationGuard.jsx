import PropTypes from 'prop-types'
import React from 'react'

import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { ErrorView } from './ErrorView'
import { LoadingFrame } from './LoadingFrame'

const DumbReputationGuard = ({
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

export default ReputationGuard
