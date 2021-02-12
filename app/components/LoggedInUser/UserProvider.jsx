import React from 'react'
import User from '../../state/users/record'
import { HttpApi, SocketApi } from '../../API'
import {
  getFromLocalStorage,
  LOCAL_STORAGE_KEYS,
  removeFromLocalStorage,
  setLocalStorage,
} from '../../lib/local_storage'

/**
 * A context that stores all the info about currently logged in user as long
 * with methods to update it (login, logout...) and helpers like checkReputation.
 */
export const UserContext = React.createContext({
  loggedInUser: new User(),
  loggedInUserLoading: false,
  isAuthenticated: false,
  login() {},
  logout() {},
  checkReputation() {},
  updateLoggedInUser() {},
})

/**
 * Provider for the `UserContext` context.
 */
class UserProvider extends React.Component {
  state = {
    loggedInUser: new User(JSON.parse(getFromLocalStorage(LOCAL_STORAGE_KEYS.LOGGED_IN_USER))),
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
      const loggedInUser = await HttpApi.get('users/me')
      this.updateLoggedInUser(loggedInUser)
    } catch (error) {
      if (error === 'unauthorized') {
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
      loggedInUser: new User(),
      isAuthenticated: false,
      loggedInUserLoading: false,
    })
  }

  /**
   * Check if user has the necessary `reputation`. Will always returns true
   * for publishers as they have no limitations.
   */
  checkReputation = (reputation) => {
    const { isAuthenticated, loggedInUser } = this.state
    return isAuthenticated && (loggedInUser.is_publisher || loggedInUser.reputation >= reputation)
  }

  /**
   * Update loggedInUser with given object. If `token` is provided, will also
   * update token in localStorage.
   */
  updateLoggedInUser = (loggedInUser, token) => {
    if (token) {
      this.updateToken(token)
    }

    this.setState((state) => {
      const user = state.loggedInUser.merge(loggedInUser)
      setLocalStorage(LOCAL_STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(user.toJSON()))
      return {
        loggedInUser: user,
        loggedInUserLoading: false,
        isAuthenticated: true,
      }
    })
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
  updateToken = (token) => {
    if (token) {
      HttpApi.setAuthorizationToken(token)
      SocketApi.setAuthorizationToken(token)
      setLocalStorage(LOCAL_STORAGE_KEYS.TOKEN, token)
    } else {
      HttpApi.resetToken()
      SocketApi.resetToken()
      removeFromLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)
    }
  }

  /**
   * Check if loggedInUser was updated in localStorage. This automatically
   * change the connected user if logging in/out from another tab.
   */
  onLocalStorageUpdate = (event) => {
    if (event.key === 'loggedInUser') {
      // Has logged out from another tab
      if (event.oldValue && !event.newValue) {
        return this.setState({ loggedInUser: new User(), isAuthenticated: false })
      }

      // Has logged in from another tab
      if (!event.oldValue && event.newValue) {
        const value = JSON.parse(event.newValue)
        const token = getFromLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)
        this.updateToken(token)
        return this.setState({ loggedInUser: new User(value), isAuthenticated: true })
      }

      // User updated
      const { value: oldUser } = new User(JSON.parse(event.oldValue))
      const { value: newUser } = new User(JSON.parse(event.newValue))

      if (!oldUser || !oldUser.equals(newUser)) {
        this.setState({ loggedInUser: newUser, isAuthenticated: true })
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
export const withLoggedInUser = (Component) => (props) => (
  <UserContext.Consumer>{(store) => <Component {...props} {...store} />}</UserContext.Consumer>
)

export const useLoggedInUser = () => React.useContext(UserContext)

export default UserProvider
