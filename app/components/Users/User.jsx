import { Clock } from 'lucide-react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Trans, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import { USER_PICTURE_XLARGE } from '../../constants'
import { fetchUser } from '../../state/users/displayed_user/effects'
import { resetUser } from '../../state/users/displayed_user/reducer'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
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
@withTranslation('main')
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
      <div className="w-full">
        <Helmet>
          <title>{user.name || prettyUsername}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="pt-16 bg-gradient-to-tr from-neutral-100 to-neutral-300">
          {user.id !== 0 && (
            <div className="flex items-center gap-4 container mx-auto px-4">
              <div className="bg-white p-2 rounded-xl">
                <div className="shadow-lg">
                  <UserPicture user={user} size={USER_PICTURE_XLARGE} />
                </div>
              </div>
              <div>
                <UserAppellation user={user} withoutActions />
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <Trans i18nKey="user:registeredSince">
                    Registered for
                    <TimeSince time={user.registered_at} addSuffix={false} isDateTime={false} />
                  </Trans>
                </div>
              </div>
              <div className="ml-auto">
                <ScoreTag reputation={user.reputation} withIcon className="animated-border-score" />
              </div>
            </div>
          )}
        </section>
        <div className="-mt-2 bg-white flex justify-center border-b border-gray-200">
          <div className="flex flex-wrap">
            <UserMenu user={user} isSelf={this.isSelf()}>
              {({ Icon, key, route, title, isActive }) => (
                <li
                  key={key}
                  className={`list-none border-primary ${isActive ? 'border-b-2' : ''}`}
                >
                  <Link to={route} className="flex items-center gap-2 px-4 py-2 text-neutral-700">
                    <Icon className="w-4 h-4" />
                    {title}
                  </Link>
                </li>
              )}
            </UserMenu>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}
