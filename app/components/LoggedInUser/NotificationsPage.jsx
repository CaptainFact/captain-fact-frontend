import React, { Component } from 'react'
import { withRouter, Link } from 'react-router'
import { Flex } from '@rebass/grid'
import { translate } from 'react-i18next'

import { Clock } from 'styled-icons/fa-regular/Clock'
import { Check } from 'styled-icons/fa-solid/Check'
import { PrimitiveDot } from 'styled-icons/octicons/PrimitiveDot'

import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import PaginationMenu from '../Utils/PaginationMenu'
import Message from '../Utils/Message'
import NotificationDetails from '../Notifications/NotificationDetails'
import { TimeSince } from '../Utils/TimeSince'
import Notifications from './Notifications'
import { Span } from '../StyledUtils/Text'
import StyledLink from '../StyledUtils/StyledLink'
import Container from '../StyledUtils/Container'
import Button from '../Utils/Button'

@withRouter
@translate('notifications')
export default class NotificationsPage extends Component {
  render() {
    const { t } = this.props
    return (
      <Notifications>
        {({ loading, error, notifications, pageNumber, totalPages, markAsSeen }) => {
          if (loading) {
            return <LoadingFrame />
          } else if (error) {
            return <ErrorView error={error} />
          }

          return (
            <Flex flexDirection="column" alignItems="center">
              <Container mb={3} p={[2, 4]} width={1} maxWidth={1200}>
                {notifications.length === 0 ? (
                  <Message>
                    There's no notification in here yet. They'll start appearing once
                    someone reply to one of your comments or if an action is made on a
                    video you follow.
                  </Message>
                ) : (
                  <Flex flexDirection="column">
                    <Flex justifyContent="center" mb={4}>
                      <Button
                        onClick={() => markAsSeen(notifications.map(n => n.id), true)}
                      >
                        {t('markAllAsRead')}
                      </Button>
                    </Flex>
                    {notifications.map(n => (
                      <NotificationDetails key={n.id} notification={n}>
                        {({ message, seenAt, link, insertedAt }) => (
                          <Container
                            display="flex"
                            alignItems="center"
                            mb={3}
                            p={3}
                            borderRadius={4}
                            background={seenAt ? 'white' : 'rgba(107,163,167,0.05)'}
                          >
                            <Container
                              display="flex"
                              flexDirection="column"
                              borderRight={1}
                              pr={3}
                              borderColor="black.100"
                              width={0.85}
                            >
                              <StyledLink
                                to={link}
                                onClick={() => markAsSeen(n.id, true)}
                                color="black.400"
                                mb={1}
                              >
                                {message}
                              </StyledLink>
                              <Span color="black.300">
                                <Clock size="1em" />
                                &nbsp;
                                <TimeSince time={insertedAt} />
                              </Span>
                            </Container>
                            <Flex ml={3} width={0.15} justifyContent="center">
                              {seenAt ? (
                                <PrimitiveDot
                                  cursor="pointer"
                                  size={24}
                                  onClick={() => markAsSeen(n.id, false)}
                                />
                              ) : (
                                <Check
                                  cursor="pointer"
                                  size={24}
                                  onClick={() => markAsSeen(n.id, true)}
                                />
                              )}
                            </Flex>
                          </Container>
                        )}
                      </NotificationDetails>
                    ))}
                  </Flex>
                )}
              </Container>
              {totalPages > 1 && (
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
              )}
            </Flex>
          )
        }}
      </Notifications>
    )
  }
}
