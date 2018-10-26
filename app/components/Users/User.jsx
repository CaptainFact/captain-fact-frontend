import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Trans, withNamespaces } from 'react-i18next'
import { Helmet } from 'react-helmet'

import UserAppellation from './UserAppellation'
import UserPicture from './UserPicture'
import { Icon, ErrorView } from '../Utils'
import ScoreTag from './ScoreTag'
import MediaLayout from '../Utils/MediaLayout'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { TimeSince } from '../Utils/TimeSince'
import { USER_PICTURE_XLARGE } from '../../constants'
import { fetchUser } from '../../state/users/displayed_user/effects'
import { resetUser } from '../../state/users/displayed_user/reducer'


@connect(({ CurrentUser, DisplayedUser: { isLoading, errors, data } }) => ({
  isSelf: CurrentUser.data.id === data.id,
  isLoading,
  errors,
  user: data
}), { fetchUser, resetUser })
@withNamespaces('main')
export default class User extends React.PureComponent {
  componentDidMount() {
    this.props.fetchUser(this.props.params.username)
  }

  componentDidUpdate(oldProps) {
    // If user's username was updated
    if (this.props.user.id === oldProps.user.id
      && this.props.user.username !== oldProps.user.username)
      // TODO Remove old user profile from history
      // Redirect
      this.props.router.replace(`/u/${this.props.user.username}`)

    // Showing another user
    else if (this.props.params.username !== oldProps.params.username)
      this.props.fetchUser(this.props.params.username)
  }

  componentWillUnmount() {
    this.props.resetUser()
  }

  getActiveTab(section, iconName, menuTKey, isDisabled = false) {
    const linkTo = `/u/${this.props.user.username}${section ? `/${section}` : ''}`
    const isActive = this.props.location.pathname === linkTo
    if (this.props.isLoading)
      isDisabled = true

    return (
      <li className={isActive ? 'is-active' : ''}>
        <Link to={linkTo} disabled={isDisabled}>
          <Icon name={iconName} />
          <span>{this.props.t(menuTKey)}</span>
        </Link>
      </li>
    )
  }

  render() {
    if (this.props.errors)
      return <ErrorView error={this.props.errors} canReload />
    if (this.props.isLoading)
      return <LoadingFrame />

    const user = this.props.user
    const prettyUsername = `@${user.username}`
    const isSelf = this.props.isSelf
    return (
      <div className="user-page">
        <Helmet>
          <title>{user.name || prettyUsername}</title>
        </Helmet>
        <section className="hero is-light is-bold is-medium user-header">
          {user.id !== 0 && (
            <MediaLayout
              left={
                <UserPicture user={user} size={USER_PICTURE_XLARGE} />
              }
              content={(
                <div>
                  <UserAppellation user={user} withoutActions />
                  <div className="registered-since">
                    <Icon name="clock-o" />&nbsp;
                    <Trans i18nKey="user:registeredSince">
                      Registered for
                      <TimeSince
                        time={user.registered_at}
                        addSuffix={false}
                        isDateTime={false}
                      />
                    </Trans>
                  </div>
                </div>
              )}
              right={<ScoreTag reputation={user.reputation} size="large" withIcon />}
            />
          )}
        </section>
        <div className="tabs is-centered">
          <ul>
            {this.getActiveTab('', 'user-circle', 'menu.profile')}
            {this.getActiveTab('activity', 'tasks', 'menu.activity')}
            {isSelf && this.getActiveTab('settings', 'cog', 'menu.settings')}
          </ul>
        </div>
        {this.props.children}
      </div>)
  }
}
