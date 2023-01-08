import React from 'react'
import { withNamespaces } from 'react-i18next'
import { withRouter } from 'react-router-dom'

import { LoadingFrame } from '../Utils/LoadingFrame'
import { withLoggedInUser } from './UserProvider'

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

    this.props.history.replace('/')
  }

  render() {
    return <LoadingFrame title="Disconnecting..." />
  }
}
