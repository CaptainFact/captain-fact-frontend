import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router"
import { Interpolate, translate } from 'react-i18next'

import UserAppellation from "./UserAppellation"
import UserPicture from './UserPicture'
import { Icon, ErrorView } from "../Utils"
import ScoreTag from './ScoreTag'
import MediaLayout from '../Utils/MediaLayout'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { TimeSince } from '../Utils/TimeSince'
import { USER_PICTURE_XLARGE } from '../../constants'
import { fetchUser } from '../../state/users/displayed_user/effects'
import { resetUser } from '../../state/users/displayed_user/reducer'


@connect(({CurrentUser, DisplayedUser: {isLoading, errors, data}}) => ({
  isSelf: CurrentUser.data.id === data.id,
  isLoading, errors,
  user: data
}), {fetchUser, resetUser})
@translate('main')
export default class User extends React.PureComponent {
  componentDidMount() {
    this.props.fetchUser(this.props.params.username)
  }

  componentDidUpdate(oldProps) {
    // If user's username was updated
    if (this.props.user.id === oldProps.user.id &&
        this.props.user.username !== oldProps.user.username)
          // Remove old user profile from history
          // TODO
          // Redirect
          this.props.router.replace(`/u/${this.props.user.username}`)

    // Showing another user
    else if (this.props.params.username !== oldProps.params.username)
      this.props.fetchUser(this.props.params.username)
  }

  componentWillUnmount() {
    this.props.resetUser()
  }

  getActiveTab(section, iconName, menuTKey, isDisabled=false) {
    const linkTo = `/u/${this.props.user.username}` + (section ? `/${section}` : '')
    const isActive = this.props.location.pathname === linkTo
    if (this.props.isLoading)
      isDisabled = true

    return (
      <li className={isActive ? 'is-active' : ""}>
        <Link to={linkTo} className={isDisabled ? "is-disabled" : ""}>
          <Icon name={iconName}/>
          <span>{this.props.t(menuTKey)}</span>
        </Link>
      </li>
    )
  }

  render() {
    if (this.props.errors)
      return <ErrorView error={this.props.errors} canReload={true}/>
    else if (this.props.isLoading)
      return <LoadingFrame/>

    const user = this.props.user
    const isSelf = this.props.isSelf

    return (
      <div className="user-page">
        <section className="hero is-light is-bold is-medium user-header">
          <div className="hero-body">
            <div className="container">
              {user.id !== 0 &&
                <MediaLayout
                left={
                  <UserPicture user={user} size={USER_PICTURE_XLARGE}/>
                }
                content={
                  <div>
                    <UserAppellation user={user} withoutActions={true}/>
                    <div className="registered-since">
                      <Icon name="clock-o"/>&nbsp;
                      <Interpolate i18nKey="user:registeredSince" value={
                        <TimeSince time={user.registered_at} addSuffix={false} isDateTime={false}/>
                      }/>
                    </div>
                  </div>
                }
                right={<ScoreTag reputation={user.reputation} size="large" withIcon={true}/>}/>
              }
            </div>
          </div>
        </section>
        <div className="tabs is-centered">
          <ul>
            {this.getActiveTab("", "user-circle", 'menu.profile')}
            {isSelf && this.getActiveTab("settings", "cog", 'menu.settings')}
            {isSelf && this.getActiveTab("bookmarks", "bookmark", 'menu.bookmarks', true)}
            {this.getActiveTab("activity", "tasks", 'menu.activity', true)}
          </ul>
        </div>
        { this.props.children }
    </div>)
  }
}
