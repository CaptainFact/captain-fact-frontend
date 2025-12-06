import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Clock } from 'styled-icons/fa-regular'
import { Check } from 'styled-icons/fa-solid'
import { DotFill } from 'styled-icons/octicons'

import { userNotificationsURL } from '../../lib/cf_routes'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { TimeSince } from '../Utils/TimeSince'
import NotificationDetails from './NotificationDetails'

const NotificationsPopupContent = ({ user, notifications, markAsSeen, t }) => {
  const hasUnseen = notifications.find((n) => !n.seenAt)
  return (
    <div className="flex flex-col items-center bg-background">
      <div className="flex justify-between w-full p-2 border-b border-gray-200 dark:border-border">
        <span className="font-bold dark:text-foreground">Notifications</span>
        <button
          className="bg-transparent border-0 cursor-pointer disabled:opacity-50 dark:text-foreground"
          disabled={!hasUnseen}
          onClick={() =>
            markAsSeen(
              notifications.map((n) => n.id),
              true,
            )
          }
        >
          {t('markAllAsRead')}
        </button>
      </div>
      {notifications.length === 0 ? (
        <div className="p-4 dark:text-foreground">{t('empty')}</div>
      ) : (
        <React.Fragment>
          <ScrollArea className="h-[450px] shadow-inner dark:bg-background">
            {notifications.map((n) => (
              <NotificationDetails key={n.id} notification={n}>
                {({ message, seenAt, insertedAt, link }) => (
                  <div
                    className={`flex text-xs p-2 border-b border-gray-200 dark:border-border ${!seenAt ? 'bg-blue-50 dark:bg-blue-950/30' : ''} hover:bg-blue-50/20 dark:hover:bg-blue-950/40`}
                  >
                    <Link to={link} onClick={() => markAsSeen(n.id, true)} className="flex-1">
                      <div className="flex flex-col">
                        <span className="mb-1 text-gray-700 dark:text-foreground">{message}</span>
                        <span className="text-muted-foreground">
                          <Clock size="1em" />
                          &nbsp;
                          <TimeSince time={insertedAt} />
                        </span>
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => markAsSeen(n.id, !seenAt)}
                    >
                      {seenAt ? <DotFill size={12} /> : <Check size={12} />}
                    </Button>
                  </div>
                )}
              </NotificationDetails>
            ))}
          </ScrollArea>
          <div className="p-2 w-full text-center shadow-[0_-5px_15px_-5px_#f4f4f4] dark:shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.3)] border-t dark:border-border">
            <Link to={userNotificationsURL(user)}>
              <Button variant="outline">{t('seeAll')}</Button>
            </Link>
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

NotificationsPopupContent.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
  markAsSeen: PropTypes.func.isRequired,
}

export default withTranslation('notifications')(NotificationsPopupContent)
