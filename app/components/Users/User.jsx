import { Clock } from 'lucide-react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Trans, withTranslation } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'

import GraphQLClient from '../../API/graphql_api'
import { UserQuery } from '../../API/graphql_queries'
import { USER_PICTURE_XLARGE } from '../../constants'
import parseDateTime from '../../lib/parse_datetime'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { TimeSince } from '../Utils/TimeSince'
import ScoreTag from './ScoreTag'
import UserAppellation from './UserAppellation'
import UserMenu from './UserMenu'
import UserPicture from './UserPicture'

// Context to provide user data to child components
export const DisplayedUserContext = React.createContext({
  user: {
    id: 0,
    username: '___________',
    name: '',
    reputation: 0,
    registeredAt: null,
  },
})

@withTranslation('main')
@withLoggedInUser
@withRouter
export default class User extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      errors: null,
      user: {
        id: 0,
        username: '___________',
        name: '',
        reputation: 0,
        registeredAt: null,
      },
    }
  }

  componentDidMount() {
    this.fetchUser(this.props.match.params.username)
  }

  componentDidUpdate(oldProps, oldState) {
    // If user's username was updated
    if (
      this.state.user.id !== 0 &&
      this.state.user.id === oldState.user?.id &&
      this.state.user.username !== oldState.user?.username
    ) {
      // TODO Remove old user profile from history
      // Redirect
      this.props.history.replace(`/u/${this.state.user.username}`)
    }
    // Showing another user
    else if (this.props.match.params.username !== oldProps.match.params.username) {
      this.fetchUser(this.props.match.params.username)
    }
  }

  fetchUser(username) {
    this.setState({ isLoading: true, errors: null })
    GraphQLClient.query({
      query: UserQuery,
      variables: { username },
      fetchPolicy: 'network-only',
    })
      .then(({ data }) => {
        const user = data?.user
        if (!user) {
          throw new Error('User not found')
        }
        this.setState({
          user,
          isLoading: false,
          errors: null,
        })
      })
      .catch((error) => {
        this.setState({
          errors: error,
          isLoading: false,
        })
      })
  }

  isSelf() {
    return (
      this.props.isAuthenticated &&
      this.props.loggedInUser?.id?.toString() === this.state.user.id
    )
  }

  render() {
    if (this.state.errors) {
      return <ErrorView error={this.state.errors} canReload />
    }
    if (this.state.isLoading) {
      return <LoadingFrame />
    }

    const user = this.state.user || {}
    const prettyUsername = `@${user.username}`

    return (
      <div className="w-full">
        <Helmet>
          <title>{user.name || prettyUsername}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="pt-16 bg-gradient-to-tr from-neutral-100 to-neutral-300 dark:from-[hsl(0,0%,14%)] dark:to-[hsl(0,0%,16%)]">
          {user.id !== 0 && (
            <div className="flex items-center gap-4 container mx-auto px-4">
              <div className="bg-white dark:bg-background p-2 rounded-xl">
                <div className="shadow-lg">
                  <UserPicture user={user} size={USER_PICTURE_XLARGE} />
                </div>
              </div>
              <div>
                <UserAppellation user={user} withoutActions />
                <div className="flex items-center gap-2 text-gray-600 dark:text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    <Trans i18nKey="user:registeredSince">
                      Registered for
                      <TimeSince time={user.registeredAt} addSuffix={false} isDateTime={false} />
                    </Trans>
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                <ScoreTag reputation={user.reputation} withIcon className="animated-border-score" />
              </div>
            </div>
          )}
        </section>
        <div className="-mt-2 bg-white dark:bg-background flex justify-center border-b border-gray-200 dark:border-border">
          <div className="flex flex-wrap">
            <UserMenu user={user} isSelf={this.isSelf()}>
              {({ Icon, key, route, title, isActive }) => (
                <li
                  key={key}
                  className={`list-none border-primary ${isActive ? 'border-b-2' : ''}`}
                >
                  <Link
                    to={route}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-foreground hover:text-neutral-900 dark:hover:text-foreground"
                  >
                    <Icon className="w-4 h-4" />
                    {title}
                  </Link>
                </li>
              )}
            </UserMenu>
          </div>
        </div>
        <DisplayedUserContext.Provider value={{ user }}>
          {this.props.children}
        </DisplayedUserContext.Provider>
      </div>
    )
  }
}
