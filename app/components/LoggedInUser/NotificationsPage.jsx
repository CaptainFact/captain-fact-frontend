import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { get } from 'lodash'
import { withRouter, Link } from 'react-router'

import { Flex, Box } from '@rebass/grid'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import PaginationMenu from '../Utils/PaginationMenu'
import Message from '../Utils/Message'
import StyledCard from '../Utils/StyledCard'
import NotificationDetails from '../Notifications/NotificationDetails'
import { TimeSince } from '../Utils/TimeSince'
import Notifications from './Notifications'

@withRouter
export default class NotificationsPage extends Component {
  render() {
    return (
      <Notifications>
        {({ loading, error, notifications, pageNumber, totalPages }) => {
          if (loading) {
            return <LoadingFrame />
          } else if (error) {
            return <ErrorView error={error} />
          }

          return (
            <Flex flexDirection="column" alignItems="center">
              <Box mb={3} p={[2, 4]}>
                {notifications.length === 0 ? (
                  <Message>
                    There's no notification in here yet. They'll start appearing once
                    someone reply to one of your comments or if an action is made on a
                    video you follow.
                  </Message>
                ) : (
                  <Flex flexDirection="column">
                    {notifications.map(n => (
                      <NotificationDetails key={n.id} notification={n}>
                        {({ message, seenAt, insertedAt }) => (
                          <StyledCard px={[3, 4]} py={[2, 3]}>
                            <Flex>
                              {' '}
                              <Box>{message}</Box>
                              <Box mx={2}>|</Box>
                              <Box>{seenAt ? 'Seen' : 'Not seen'}</Box>
                              <Box mx={2}>|</Box>
                              <Box>
                                <TimeSince time={insertedAt} />
                              </Box>
                            </Flex>
                          </StyledCard>
                        )}
                      </NotificationDetails>
                    ))}
                  </Flex>
                )}
              </Box>
              <PaginationMenu
                className="videos-pagination"
                currentPage={pageNumber}
                total={totalPages}
                isRounded
                onPageChange={() => window.scrollTo({ top: 0 })}
                LinkBuilder={({ 'data-page': page, ...props }) => {
                  return <Link className="button" {...props} />
                }}
              />
            </Flex>
          )
        }}
      </Notifications>
    )
  }
}
