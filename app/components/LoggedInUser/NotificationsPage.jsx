import React, { Component } from 'react'
import FlipMove from 'react-flip-move'
import { withTranslation } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import { Clock } from 'styled-icons/fa-regular'
import { Check } from 'styled-icons/fa-solid'
import { DotFill } from 'styled-icons/octicons'

import { optionsToQueryString } from '../../lib/url_utils'
import NotificationDetails from '../Notifications/NotificationDetails'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import PaginationMenu from '../Utils/PaginationMenu'
import { TimeSince } from '../Utils/TimeSince'
import Notifications from './Notifications'
import { withLoggedInUser } from './UserProvider'

const FILTERS = ['ALL', 'SEEN', 'UNSEEN']

@withRouter
@withTranslation('notifications')
@withLoggedInUser
export default class NotificationsPage extends Component {
  buildLink(page, filter) {
    return `/u/${this.props.loggedInUser.username}/notifications${optionsToQueryString({
      page: page === 1 ? undefined : page,
      filter: filter === 'ALL' ? undefined : filter,
    })}`
  }

  getFilter(searchParams) {
    const filter = searchParams.get('filter')
    return FILTERS.includes(filter) ? filter : 'ALL'
  }

  renderFilters(selected) {
    return (
      <Tabs value={selected}>
        <TabsList>
          {FILTERS.map((filter) => (
            <Link key={filter} to={this.buildLink(1, filter)}>
              <TabsTrigger value={filter}>{this.props.t(`filters.${filter}`)}</TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
    )
  }

  renderNotifications(notifications, markAsSeen) {
    return notifications.length === 0 ? (
      <Card className="text-center py-6 my-6">{this.props.t('empty')}</Card>
    ) : (
      <Card>
        <FlipMove>
          {notifications.map((n) => (
            <NotificationDetails key={n.id} notification={n}>
              {({ message, seenAt, link, insertedAt }) => (
                <div
                  className={`flex items-center border-b last:border-none p-4 rounded hover:bg-blue-50/20
                      ${seenAt ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <div className="flex flex-col pr-3 border-r border-gray-200 w-[85%] text-sm">
                    <Link
                      to={link}
                      onClick={() => markAsSeen(n.id, true)}
                      className="text-gray-700 mb-1 hover:text-gray-900"
                    >
                      {message}
                    </Link>
                    <span className="text-gray-500">
                      <Clock size="1em" />
                      &nbsp;
                      <TimeSince time={insertedAt} />
                    </span>
                  </div>
                  <div className="ml-3 w-[15%] flex justify-center">
                    <Button variant="ghost" onClick={() => markAsSeen(n.id, !seenAt)}>
                      {seenAt ? <DotFill size={24} /> : <Check size={24} />}
                    </Button>
                  </div>
                </div>
              )}
            </NotificationDetails>
          ))}
        </FlipMove>
      </Card>
    )
  }

  render() {
    const { t, location } = this.props
    const searchParams = new URLSearchParams(location.search)
    const pageNumber = parseInt(searchParams.get('page')) || 1
    const filter = this.getFilter(searchParams)
    const pollInterval = filter === 'ALL' && pageNumber === 1 ? 15000 : 0 // Only poll on first page

    return (
      <Notifications
        pageSize={10}
        pageNumber={pageNumber}
        filter={filter}
        pollInterval={pollInterval}
      >
        {({ loading, error, notifications, pageNumber, totalPages, markAsSeen }) => {
          if (error) {
            return <ErrorView error={error} />
          }

          const hasSeen = notifications && notifications.find((n) => n.seenAt)
          const hasUnseen = notifications && notifications.find((n) => !n.seenAt)
          return (
            <div className="flex flex-col items-center my-6">
              <div className="mb-3 p-2 md:p-4 w-full max-w-[1200px]">
                <div className="flex flex-col">
                  <div className="flex justify-between mb-4 flex-wrap">
                    <div className="flex">{this.renderFilters(filter)}</div>
                    <div className="flex flex-wrap">
                      <div className="mr-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            markAsSeen(
                              notifications.map((n) => n.id),
                              false,
                            )
                          }
                          disabled={!hasSeen}
                        >
                          {t('markAllAsUnseen')}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          markAsSeen(
                            notifications.map((n) => n.id),
                            true,
                          )
                        }
                        disabled={!hasUnseen}
                      >
                        {t('markAllAsRead')}
                      </Button>
                    </div>
                  </div>

                  {loading ? <LoadingFrame /> : this.renderNotifications(notifications, markAsSeen)}
                </div>
              </div>
              {totalPages > 1 && (
                <PaginationMenu
                  currentPage={pageNumber}
                  total={totalPages}
                  getPageLink={(page) => this.buildLink(page, filter)}
                />
              )}
            </div>
          )
        }}
      </Notifications>
    )
  }
}
