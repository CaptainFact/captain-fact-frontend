import React, { Component } from 'react'
import { withRouter, Link } from 'react-router'
import { Flex, Box } from '@rebass/grid'
import { translate } from 'react-i18next'
import FlipMove from 'react-flip-move'

import { Clock } from 'styled-icons/fa-regular'
import { Check } from 'styled-icons/fa-solid'
import { DotFill } from 'styled-icons/octicons'

import { optionsToQueryString } from '../../lib/url_utils'
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
import { withLoggedInUser } from './UserProvider'

const FILTERS = ['ALL', 'SEEN', 'UNSEEN']

@withRouter
@translate('notifications')
@withLoggedInUser
export default class NotificationsPage extends Component {
  buildLink(page, filter) {
    return `/u/${this.props.loggedInUser.username}/notifications${optionsToQueryString({
      page: page === 1 ? undefined : page,
      filter: filter === 'ALL' ? undefined : filter,
    })}`
  }

  getFilter(location) {
    return FILTERS.includes(location.query.filter) ? location.query.filter : 'ALL'
  }

  renderFilters(selected) {
    return FILTERS.map((filter) => (
      <StyledLink
        key={filter}
        mx={3}
        fontWeight={selected === filter ? 'bold' : 'normal'}
        to={this.buildLink(1, filter)}
      >
        {this.props.t(`filters.${filter}`)}
      </StyledLink>
    ))
  }

  renderNotifications(notifications, markAsSeen) {
    return notifications.length === 0 ? (
      <Message>{this.props.t('empty')}</Message>
    ) : (
      <FlipMove>
        {notifications.map((n) => (
          <NotificationDetails key={n.id} notification={n}>
            {({ message, seenAt, link, insertedAt }) => (
              <Container
                display="flex"
                alignItems="center"
                mb={3}
                p={3}
                borderRadius={4}
                background={seenAt ? 'white' : 'rgba(117,202,255,0.15)'}
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
                    <DotFill cursor="pointer" size={24} onClick={() => markAsSeen(n.id, false)} />
                  ) : (
                    <Check cursor="pointer" size={24} onClick={() => markAsSeen(n.id, true)} />
                  )}
                </Flex>
              </Container>
            )}
          </NotificationDetails>
        ))}
      </FlipMove>
    )
  }

  render() {
    const { t, location } = this.props
    const pageNumber = parseInt(location.query.page) || 1
    const filter = this.getFilter(location)
    const pollInterval = filter === 'ALL' && pageNumber === 1 ? 15000 : 0 // Only poll on first page

    return (
      <Notifications pageSize={10} pageNumber={pageNumber} filter={filter}>
        {({ loading, error, notifications, pageNumber, totalPages, markAsSeen }) => {
          if (error) {
            return <ErrorView error={error} />
          }

          const hasSeen = notifications && notifications.find((n) => n.seenAt)
          const hasUnseen = notifications && notifications.find((n) => !n.seenAt)
          return (
            <Flex flexDirection="column" alignItems="center">
              <Container mb={3} p={[2, 4]} width={1} maxWidth={1200}>
                <Flex flexDirection="column">
                  <Flex justifyContent="space-between" mb={4} flexWrap="wrap">
                    <Flex>{this.renderFilters(filter)}</Flex>
                    <Flex flexWrap="wrap">
                      <Box mr={2}>
                        <Button
                          onClick={() =>
                            markAsSeen(
                              notifications.map((n) => n.id),
                              false
                            )
                          }
                          disabled={!hasSeen}
                        >
                          {t('markAllAsUnseen')}
                        </Button>
                      </Box>
                      <Button
                        onClick={() =>
                          markAsSeen(
                            notifications.map((n) => n.id),
                            true
                          )
                        }
                        disabled={!hasUnseen}
                      >
                        {t('markAllAsRead')}
                      </Button>
                    </Flex>
                  </Flex>

                  {loading ? <LoadingFrame /> : this.renderNotifications(notifications, markAsSeen)}
                </Flex>
              </Container>
              {totalPages > 1 && (
                <PaginationMenu
                  className="videos-pagination"
                  currentPage={pageNumber}
                  total={totalPages}
                  isRounded
                  onPageChange={() => window.scrollTo({ top: 0 })}
                  pollInterval={pollInterval}
                  LinkBuilder={({ 'data-page': page, ...props }) => {
                    return <Link to={this.buildLink(page, filter)} className="button" {...props} />
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
