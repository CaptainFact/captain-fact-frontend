import { Query } from '@apollo/client/react/components'
import { get } from 'lodash'
import React from 'react'
import { Bell } from 'styled-icons/fa-solid'

import { loggedInUserUnreadNotificationsCount } from '../../API/graphql_queries'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const NotificationBell = (props, ref) => (
  <Button variant="ghost" {...props} ref={ref}>
    <Query
      fetchPolicy="network-only"
      pollInterval={15000}
      query={loggedInUserUnreadNotificationsCount}
    >
      {({ data }) => {
        const unreadCount = get(data, 'loggedInUser.notifications.totalEntries', 0)
        return (
          <div className="relative">
            <Bell size={24} />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 py-[2px] px-1 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
        )
      }}
    </Query>
  </Button>
)

export default React.forwardRef(NotificationBell)
