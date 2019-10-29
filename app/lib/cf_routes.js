import { get } from 'lodash'

import {
  ENTITY_COMMENT,
  ENTITY_STATEMENT,
  ACTION_REMOVE,
  ENTITY_VIDEO,
  ACTION_UPDATE,
  ENTITY_SPEAKER,
  ACTION_ADD
} from '../constants'
import { FRONTEND_URL } from '../config'

export const videoURL = videoHashID => {
  return `/videos/${videoHashID}`
}

export const videoHistoryURL = videoHashID => {
  return `${videoURL(videoHashID)}/history`
}

export const statementURL = (videoHashID, statementID) => {
  return `${videoURL(videoHashID)}?statement=${statementID}`
}

export const commentURL = (videoHashID, statementID, commentID) => {
  return `${statementURL(videoHashID, statementID)}&c=${commentID}`
}

export const speakerURL = speakerIDOrSlug => `/s/${speakerIDOrSlug}`

/** Returns a frontend URL linking to the entity for a UserAction */
export const userActionURL = action => {
  const videoHashId = action.videoHashId || action.video.hashId
  if (action.type === ACTION_REMOVE) {
    return videoHistoryURL(videoHashId)
  } else if (action.entity === ENTITY_COMMENT) {
    return commentURL(videoHashId, action.statementId, action.commentId)
  } else if (action.entity === ENTITY_STATEMENT) {
    return statementURL(videoHashId, action.statementId)
  } else if (action.entity === ENTITY_VIDEO && action.type === ACTION_UPDATE) {
    return videoHistoryURL(videoHashId)
  } else if (action.entity === ENTITY_SPEAKER && action.type === ACTION_ADD) {
    return videoHashId
      ? videoURL(videoHashId)
      : speakerURL(get(action, 'speaker.slug') || action.speakerId)
  } else {
    console.log("Don't know how to generate URL for action", action)
  }
}

export const userProfileURL = user => `/u/${user.username}`

export const userNotificationsURL = user => `${userProfileURL(user)}/notifications`

/** A helper to convert the URLs in this file to their absolute counterpart */
export const toAbsoluteURL = subPath => {
  return FRONTEND_URL + subPath
}
