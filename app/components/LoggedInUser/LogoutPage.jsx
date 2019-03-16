import React from 'react'
import { withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'

import { withLoggedInUser } from './UserProvider'
import { LoadingFrame } from '../Utils/LoadingFrame'

@withRouter
@withNamespaces('user')
@withLoggedInUser
export default class LogoutPage extends React.Component {
  componentDidMount() {
    this.logoutAndRedirect()
  }

  componentDidUpdate() {
    this.logoutAndRedirect()
  }

  async logoutAndRedirect() {
    // Redirect if user is loading
    if (this.props.loggedInUserLoading) {
      return
    }

    // Already unauthenticated, redirect
    if (this.props.isAuthenticated) {
      await this.props.logout()
    }

    this.props.router.replace('/')
  }

  render() {
    return <LoadingFrame title="Disconnecting..." />
  }
}
