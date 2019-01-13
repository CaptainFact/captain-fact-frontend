import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { withNamespaces, Trans } from 'react-i18next'

const messageRenderers = {
  new_comment: ({ action: { video, user } }) => {
    if (user) {
      return (
        <Trans i18nKey="message.newComment">
          New comment from{' '}
          <Link to={`/u/${user.username}`}>{{ username: user.username }}</Link> on{' '}
          <Link to={`/videos/${video.hashId}`}>{{ title: video.title }}</Link>
        </Trans>
      )
    } else {
      return (
        <Trans i18nKey="message.newCommentAnonymous">
          New comment from deleted account on{' '}
          <Link to={`/videos/${video.hashId}`}>{{ title: video.title }}</Link>
        </Trans>
      )
    }
  }
}

/**
 * This component takes a notification and provide `children` all the data
 * it needs to display it.
 */
const NotificationDetails = ({ notification, children }) => {
  const renderer = messageRenderers[notification.type]
  const message = renderer ? renderer(notification) : '____________'
  return children({ ...notification, message })
}

NotificationDetails.propTypes = {
  /** The notification to display */
  notification: PropTypes.shape({
    type: PropTypes.string.isRequired
  }).isRequired,
  /** The children in charge of rendering the notification */
  children: PropTypes.func.isRequired
}

export default withNamespaces('notifications')(NotificationDetails)
