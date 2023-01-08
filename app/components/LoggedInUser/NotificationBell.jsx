import { Query } from '@apollo/client/react/components'
import { get } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { Bell } from 'styled-icons/fa-solid'
import { themeGet } from 'styled-system'

import { loggedInUserUnreadNotificationsCount } from '../../API/graphql_queries'
import Container from '../StyledUtils/Container'
import UnstyledButton from '../StyledUtils/UnstyledButton'

const UnreadNotificationsBadge = styled.div`
  position: absolute;
  background: ${themeGet('colors.info')};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  top: -5px;
  right: -5px;
`

const NotificationBell = (props, ref) => (
  <UnstyledButton p="7px" {...props} ref={ref}>
    <Query
      fetchPolicy="network-only"
      pollInterval={15000}
      query={loggedInUserUnreadNotificationsCount}
    >
      {({ data }) => {
        const unreadCount = get(data, 'loggedInUser.notifications.totalEntries', 0)
        return (
          <Container position="relative">
            <Bell size={24} />
            {unreadCount > 0 && <UnreadNotificationsBadge>{unreadCount}</UnreadNotificationsBadge>}
          </Container>
        )
      }}
    </Query>
  </UnstyledButton>
)

export default React.forwardRef(NotificationBell)
