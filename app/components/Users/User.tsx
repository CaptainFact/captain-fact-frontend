import { useQuery } from '@apollo/client'
import { Clock } from 'lucide-react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Trans } from 'react-i18next'
import { Link, useHistory, useParams } from 'react-router-dom'

import { UserQuery } from '../../API/graphql_queries'
import { USER_PICTURE_XLARGE } from '../../constants'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { NotFound } from '../Pages'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { TimeSince } from '../Utils/TimeSince'
import ScoreTag from './ScoreTag'
import UserAppellation from './UserAppellation'
import UserMenu from './UserMenu'
import UserPicture from './UserPicture'

// Context to provide user data to child components
export const DisplayedUserContext = React.createContext<{ user: UserData | null }>({
  user: null,
})

interface UserProps {
  children?: React.ReactNode
}

interface UserData {
  id: number | string
  username: string
  name: string
  reputation: number
  registeredAt: string | null
  picture_url?: string
  mini_picture_url?: string
  pictureUrl?: string
  miniPictureUrl?: string
  [key: string]: unknown
}

const User: React.FC<UserProps> = ({ children }) => {
  const { username } = useParams<{ username: string }>()
  const history = useHistory()
  const { isAuthenticated, loggedInUser } = useLoggedInUser()

  const { data, loading, error } = useQuery(UserQuery, {
    variables: { username },
    skip: !username,
  })

  const user = data?.user as UserData | undefined

  useEffect(() => {
    // If user's username was updated
    if (user && user.id !== 0 && user.username !== '___________' && username !== user.username) {
      // TODO Remove old user profile from history
      // Redirect
      history.replace(`/u/${user.username}`)
    }
  }, [user?.id, user?.username, username, history])

  const isSelf = React.useMemo(() => {
    return isAuthenticated && loggedInUser?.id?.toString() === user?.id?.toString()
  }, [isAuthenticated, loggedInUser, user?.id])

  if (error) {
    return <ErrorView error={error} canReload />
  }
  if (loading) {
    return <LoadingFrame />
  } else if (!user) {
    return <NotFound />
  }

  const prettyUsername = `@${user.username}`
  return (
    <div className="w-full">
      <Helmet>
        <title>{user.name || prettyUsername}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="pt-16 bg-gradient-to-tr from-neutral-100 to-neutral-300 dark:from-[hsl(0,0%,14%)] dark:to-[hsl(0,0%,16%)]">
        {user && (
          <div className="flex items-center gap-4 container mx-auto px-4">
            <div className="bg-white dark:bg-background p-2 rounded-xl">
              <div className="shadow-lg">
                <UserPicture
                  user={{
                    username: user.username,
                    name: user.name,
                    picture_url: user.picture_url || '',
                    mini_picture_url: user.mini_picture_url || '',
                    pictureUrl: user.pictureUrl || '',
                    miniPictureUrl: user.miniPictureUrl || '',
                  }}
                  size={USER_PICTURE_XLARGE}
                />
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
          <UserMenu user={user} isSelf={isSelf}>
            {({ Icon, key, route, title, isActive }) => (
              <li key={key} className={`list-none border-primary ${isActive ? 'border-b-2' : ''}`}>
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
      <DisplayedUserContext.Provider value={{ user }}>{children}</DisplayedUserContext.Provider>
    </div>
  )
}

export default User
