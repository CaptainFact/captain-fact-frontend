import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces, Trans } from 'react-i18next'
import { truncate } from 'lodash'

import { userActionURL } from '../../lib/cf_routes'
import UserAppellation from '../Users/UserAppellation'

const getTruncatedChange = (changes, key, maxLength) => {
  try {
    const parsedChanges = JSON.parse(changes)
    return truncate(parsedChanges[key], maxLength) || ''
  } catch {
    return ''
  }
}

const NotifUserAppelation = ({ user }) => (
  <UserAppellation defaultComponent="span" withoutActions user={user} />
)

const Quote = ({ children }) => (
  <i>
    <q>{children}</q>
  </i>
)

const messageRenderers = {
  new_comment: ({ action: { video, user, comment } }) => {
    return (
      <Trans i18nKey="message.newComment">
        New comment from{' '}
        <strong>
          <NotifUserAppelation user={user} />
        </strong>{' '}
        on <strong>{{ videoTitle: video.title }}</strong>:{' '}
        <Quote>{{ text: truncate(comment.text, 40) }}</Quote>
      </Trans>
    )
  },
  reply_to_comment: ({ action: { user, video, comment } }) => (
    <Trans i18nKey="message.replyToComment">
      <strong>
        <NotifUserAppelation user={user} />
      </strong>{' '}
      replied to your comment on <strong>{{ videoTitle: video.title }}</strong>:{' '}
      <Quote>{{ text: truncate(comment.text, 40) }}</Quote>
    </Trans>
  ),
  new_speaker: ({ action: { user, speaker, video } }) => (
    <Trans i18nKey="message.newSpeaker">
      <strong>
        <NotifUserAppelation user={user} />
      </strong>{' '}
      added {{ speakerName: speaker.fullName }} to the speakers on{' '}
      <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  new_statement: ({ action: { user, video, changes } }) => (
    <Trans i18nKey="message.newStatement">
      <strong>
        <NotifUserAppelation user={user} />
      </strong>{' '}
      added a statement on <strong>{{ videoTitle: video.title }}</strong>:{' '}
      <Quote>{{ text: getTruncatedChange(changes, 'text', 40) }}</Quote>
    </Trans>
  ),
  updated_statement: ({ action: { user, video, changes } }) => (
    <Trans i18nKey="message.updatedStatement">
      <strong>
        <NotifUserAppelation user={user} />
      </strong>{' '}
      updated a statement on <strong>{{ videoTitle: video.title }}</strong>:{' '}
      <Quote>{{ text: getTruncatedChange(changes, 'text', 40) }}"</Quote>
    </Trans>
  ),
  updated_video: ({ action: { user, video } }) => (
    <Trans i18nKey="message.updatedVideo">
      <strong>
        <NotifUserAppelation user={user} />
      </strong>{' '}
      updated video's details: <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  updated_speaker: ({ action: { user, speaker } }) => (
    <Trans i18nKey="message.updatedSpeaker">
      <strong>
        <NotifUserAppelation user={user} />
      </strong>{' '}
      updated {{ speakerName: speaker.fullName }}'s details
    </Trans>
  ),
  removed_speaker: ({ action: { user, video, speaker } }) => (
    <Trans i18nKey="message.removedSpeaker">
      <strong>
        <NotifUserAppelation user={user} />
      </strong>{' '}
      removed {{ speakerName: speaker.fullName }} from{' '}
      <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  removed_statement: ({ action: { user, video } }) => (
    <Trans i18nKey="message.removedStatement">
      <strong>
        <NotifUserAppelation user={user} />
      </strong>{' '}
      removed a statement on <strong>{{ videoTitle: video.title }}</strong>
    </Trans>
  ),
  email_confirmed: () => (
    <Trans i18nKey="message.emailConfirmed">
      Yay! Your email is now confirmed 💪💪💪 (+15pts reputation)
    </Trans>
  ),
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
    type: PropTypes.string.isRequired,
  }).isRequired,
  /** The children in charge of rendering the notification */
  children: PropTypes.func.isRequired,
}

export default withNamespaces('notifications')(NotificationDetails)
