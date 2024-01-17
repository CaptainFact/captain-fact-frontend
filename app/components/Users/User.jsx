import { Flex } from '@rebass/grid'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Trans, withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Clock } from 'styled-icons/fa-regular'

import { USER_PICTURE_XLARGE } from '../../constants'
import { fetchUser } from '../../state/users/displayed_user/effects'
import { resetUser } from '../../state/users/displayed_user/reducer'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { ErrorView } from '../Utils'
import { LoadingFrame } from '../Utils/LoadingFrame'
import MediaLayout from '../Utils/MediaLayout'
import { TimeSince } from '../Utils/TimeSince'
import ScoreTag from './ScoreTag'
import UserAppellation from './UserAppellation'
import UserMenu from './UserMenu'
import UserPicture from './UserPicture'

@connect(
  ({ DisplayedUser: { isLoading, errors, data } }) => ({
    isLoading,
    errors,
    user: data,
  }),
  { fetchUser, resetUser },
)
@withNamespaces('main')
@withLoggedInUser
@withRouter
export default class User extends React.PureComponent {
  componentDidMount() {
    this.props.fetchUser(this.props.match.params.username)
  }

  componentDidUpdate(oldProps) {
    // If user's username was updated
    if (
      this.props.user.id === oldProps.user.id &&
      this.props.user.username !== oldProps.user.username
    ) {
      // TODO Remove old user profile from history
      // Redirect
      this.props.history.replace(`/u/${this.props.user.username}`)
    }
    // Showing another user
    else if (this.props.match.params.username !== oldProps.match.params.username) {
      this.props.fetchUser(this.props.match.params.username)
    }
  }

  componentWillUnmount() {
    this.props.resetUser()
  }

  isSelf() {
    return this.props.isAuthenticated && this.props.loggedInUser.id === this.props.user.id
  }

  render() {
    if (this.props.errors) {
      return <ErrorView error={this.props.errors} canReload />
    }
    if (this.props.isLoading) {
      return <LoadingFrame />
    }

    const user = this.props.user || {}
    const prettyUsername = `@${user.username}`

    return (
      <div className="user-page">
        <Helmet>
          <title>{user.name || prettyUsername}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="hero is-light is-bold is-medium user-header">
          {user.id !== 0 && (
            <MediaLayout
              left={<UserPicture user={user} size={USER_PICTURE_XLARGE} />}
              content={
                <div>
                  <UserAppellation user={user} withoutActions />
                  <div className="registered-since">
                    <Clock size="1em" />
                    &nbsp;
                    <Trans i18nKey="user:registeredSince">
                      Registered for
                      <TimeSince time={user.registered_at} addSuffix={false} isDateTime={false} />
                    </Trans>
                  </div>
                </div>
              }
              right={<ScoreTag reputation={user.reputation} size="large" withIcon />}
            />
          )}
        </section>
        <div className="tabs is-centered">
          <Flex as="ul" flexWrap="wrap">
            <UserMenu user={user} isSelf={this.isSelf()}>
              {({ Icon, key, route, title, isActive }) => (
                <li key={key} className={isActive ? 'is-active' : ''}>
                  <Link to={route}>
                    <Icon size="1em" />
                    &nbsp;
                    {title}
                  </Link>
                </li>
              )}
            </UserMenu>
          </Flex>
        </div>
        {this.props.children}
      </div>
    )
  }
}
