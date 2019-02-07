import { ENTITY_COMMENT, ENTITY_STATEMENT, ACTION_REMOVE } from '../constants'

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
  if (action.type === ACTION_REMOVE) {
    return videoHistoryURL(action.videoHashId || action.video.hashId)
  } else if (action.entity === ENTITY_COMMENT) {
    return commentURL(
      action.videoHashId || action.video.hashId,
      action.statementId,
      action.commentId
    )
  } else if (action.entity === ENTITY_STATEMENT) {
    return statementURL(action.videoHashId || action.video.hashId, action.statementId)
  }
}

export const userProfileURL = user => `/u/${user.username}`

export const userNotificationsURL = user => `${userProfileURL(user)}/notifications`
