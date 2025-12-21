import React from 'react'

import { HttpApi } from '../../API'
import GraphQLClient from '../../API/graphql_api'
import { loggedInUserQuery } from '../../API/graphql_queries'
import { User } from '../../API/types/generated'
import {
  getFromLocalStorage,
  LOCAL_STORAGE_KEYS,
  removeFromLocalStorage,
  setLocalStorage,
} from '../../lib/local_storage'

interface GraphQLError {
  extensions?: {
    code?: string
  }
}

interface ApolloError {
  graphQLErrors?: GraphQLError[]
  networkError?: {
    statusCode?: number
  }
}

interface UserContextType {
  loggedInUser: User | null
  loggedInUserLoading: boolean
  isAuthenticated: boolean
  login: () => Promise<boolean>
  logout: () => Promise<void>
  checkReputation: (reputation: number) => boolean
  updateLoggedInUser: (loggedInUser: User | null, token?: string) => void
}

interface UserProviderState {
  loggedInUser: User | null
  loggedInUserLoading: boolean
  isAuthenticated: boolean
}

interface UserProviderProps {
  children: React.ReactNode
}

/**
 * A context that stores all the info about currently logged in user as long
 * with methods to update it (login, logout...) and helpers like checkReputation.
 */
const UserContext = React.createContext<UserContextType>({
  loggedInUser: null,
  loggedInUserLoading: false,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  checkReputation: () => false,
  updateLoggedInUser: () => {},
})

/**
 * Provider for the `UserContext` context.
 */
class UserProvider extends React.Component<UserProviderProps, UserProviderState> {
  state: UserProviderState = {
    loggedInUser: (() => {
      const stored = getFromLocalStorage(LOCAL_STORAGE_KEYS.LOGGED_IN_USER)
      return stored ? JSON.parse(stored) : null
    })(),
    loggedInUserLoading: false,
    isAuthenticated: false,
  }

  // ---- Public API ----

  /**
   * Log the current user in by loading it from localStorage if available, then
   * use the localStorage token to fetch the last info from API.
   */
  login = async () => {
    if (!getFromLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)) {
      return false
    }
    this.setState({ loggedInUserLoading: true })
    try {
      const { data } = await GraphQLClient.query({
        query: loggedInUserQuery,
        fetchPolicy: 'network-only',
      })
      if (data?.loggedInUser) {
        this.updateLoggedInUser(data.loggedInUser)
      } else {
        this.setState({ loggedInUserLoading: false })
      }
    } catch (error: unknown) {
      const apolloError = error as ApolloError
      // Check if it's an authentication error
      if (
        apolloError?.graphQLErrors?.some((e) => e.extensions?.code === 'UNAUTHENTICATED') ||
        apolloError?.networkError?.statusCode === 401
      ) {
        // Token expired
        this.logout()
      } else {
        this.setState({ loggedInUserLoading: false })
      }
    }
    return true
  }

  /**
   * Logout the loggedIn user, remove all its token and local info.
   */
  logout = async () => {
    this.updateToken(null)
    removeFromLocalStorage(LOCAL_STORAGE_KEYS.LOGGED_IN_USER)
    this.setState({
      loggedInUser: null,
      isAuthenticated: false,
      loggedInUserLoading: false,
    })
  }

  /**
   * Check if user has the necessary `reputation`. Will always returns true
   * for publishers as they have no limitations.
   */
  checkReputation = (reputation: number): boolean => {
    const { isAuthenticated, loggedInUser } = this.state
    return isAuthenticated && (loggedInUser.isPublisher || loggedInUser.reputation >= reputation)
  }

  /**
   * Update loggedInUser with given object. If `token` is provided, will also
   * update token in localStorage.
   */
  updateLoggedInUser = (loggedInUser: User | null, token?: string): void => {
    if (token) {
      this.updateToken(token)
    }

    if (loggedInUser) {
      setLocalStorage(LOCAL_STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(loggedInUser))
      this.setState({
        loggedInUser,
        loggedInUserLoading: false,
        isAuthenticated: true,
      })
    } else {
      removeFromLocalStorage(LOCAL_STORAGE_KEYS.LOGGED_IN_USER)
      this.setState({
        loggedInUser: null,
        loggedInUserLoading: false,
        isAuthenticated: false,
      })
    }
  }

  // ---- Private ----

  async componentDidMount() {
    window.addEventListener('storage', this.onLocalStorageUpdate)
    await this.login()
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.onLocalStorageUpdate)
  }

  // Update token in localStorage and for all APIs
  updateToken = (token: string | null): void => {
    if (token) {
      HttpApi.setAuthorizationToken(token)
      setLocalStorage(LOCAL_STORAGE_KEYS.TOKEN, token)
    } else {
      HttpApi.resetToken()
      removeFromLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)
    }
  }

  /**
   * Check if loggedInUser was updated in localStorage. This automatically
   * change the connected user if logging in/out from another tab.
   */
  onLocalStorageUpdate = (event: StorageEvent): void => {
    if (event.key === 'loggedInUser') {
      // Has logged out from another tab
      if (event.oldValue && !event.newValue) {
        return this.setState({ loggedInUser: null, isAuthenticated: false })
      }

      // Has logged in from another tab
      if (!event.oldValue && event.newValue) {
        const value = JSON.parse(event.newValue)
        const token = getFromLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)
        this.updateToken(token)
        return this.setState({ loggedInUser: value, isAuthenticated: true })
      }

      // User updated
      if (event.oldValue && event.newValue) {
        const oldUser = JSON.parse(event.oldValue)
        const newUser = JSON.parse(event.newValue)

        // Simple comparison - check if IDs are different or if user data changed
        if (oldUser?.id !== newUser?.id || JSON.stringify(oldUser) !== JSON.stringify(newUser)) {
          this.setState({ loggedInUser: newUser, isAuthenticated: true })
        }
      }
    }
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          login: this.login,
          logout: this.logout,
          checkReputation: this.checkReputation,
          updateLoggedInUser: this.updateLoggedInUser,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

/**
 * A high order component (HOC) that binds `UserContext` to the given `Component`.
 */
export const withLoggedInUser = <P extends object>(
  Component: React.ComponentType<P & UserContextType>,
) => {
  const WrappedComponent = (props: P) => (
    <UserContext.Consumer>{(store) => <Component {...props} {...store} />}</UserContext.Consumer>
  )
  WrappedComponent.displayName = `withLoggedInUser(${Component.displayName || Component.name || 'Component'})`
  return WrappedComponent
}

export const useLoggedInUser = (): UserContextType => React.useContext(UserContext)

export default UserProvider
