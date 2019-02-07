import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces, Trans } from 'react-i18next'
import { truncate } from 'lodash'

import { userActionURL } from '../../lib/cf_routes'

const messageRenderers = {
  new_comment: ({ action: { video, user, comment } }) => {
    return user ? (
      <Trans i18nKey="message.newComment">
        New comment from <strong>@{{ username: user.username }}</strong> on{' '}
        <strong>{{ videoTitle: video.title }}</strong>:{' '}
        {{ text: truncate(comment.text, 40) }}
      </Trans>
    ) : (
      <Trans i18nKey="message.newCommentAnonymous">
        New comment from deleted account on <strong>{{ videoTitle: video.title }}</strong>
        : {{ text: truncate(comment.text, 40) }}
      </Trans>
    )
  },
  reply_to_comment: ({ action: { user, video, comment } }) => (
    <Trans i18nKey="message.replyToComment">
      <strong>@{{ username: user.username }}</strong> replied to your comment on{' '}
      <strong>{{ videoTitle: video.title }}</strong>:{' '}
      {{ text: truncate(comment.text, 40) }}
    </Trans>
  ),
  new_speaker: ({ action: { user, speaker, video } }) => (
    <Trans i18nKey="message.newSpeaker">
      <strong>@{{ username: user.username }}</strong> added{' '}
      {{ speakerName: speaker.fullName }} to the speakers on{' '}
      <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  new_statement: ({ action: { user, video } }) => (
    <Trans i18nKey="message.newSpeaker">
      <strong>@{{ username: user.username }}</strong> added a statement on{' '}
      <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  updated_statement: ({ action: { user, video } }) => (
    <Trans i18nKey="message.newSpeaker">
      <strong>@{{ username: user.username }}</strong> updated a statement on{' '}
      <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  updated_video: ({ action: { user, video } }) => (
    <Trans i18nKey="message.newSpeaker">
      <strong>@{{ username: user.username }}</strong> updated video's details:{' '}
      <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  updated_speaker: ({ action: { user, speaker } }) => (
    <Trans i18nKey="message.newSpeaker">
      <strong>@{{ username: user.username }}</strong> updated{' '}
      {{ speakerName: speaker.fullName }}'s' details
    </Trans>
  ),
  removed_speaker: ({ action: { user, video, speaker } }) => (
    <Trans i18nKey="message.removedSpeaker">
      <strong>@{{ username: user.username }}</strong> removed{' '}
      {{ speakerName: speaker.fullName }} from{' '}
      <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  removed_statement: ({ action: { user, video } }) => (
    <Trans i18nKey="message.removedStatement">
      <strong>@{{ username: user.username }}</strong> removed a statement on{' '}
      <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  email_confirmed: () => (
    <Trans i18nKey="message.emailConfirmed">
      Yay! Your email is now confirmed 💪💪💪 (+15pts reputation)
    </Trans>
  )
}

/**
 * This component takes a notification and provide `children` all the data
 * it needs to display it.
 */
const NotificationDetails = ({ notification, children }) => {
  const renderer = messageRenderers[notification.type]

  if (!renderer) {
    console.warn('Unknown renderer for notification', notification)
    return null
  }

  const link = userActionURL(notification.action)
  return children({ ...notification, message: renderer(notification), link })
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
