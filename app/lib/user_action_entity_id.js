import {
  ENTITY_VIDEO,
  ENTITY_SPEAKER,
  ENTITY_STATEMENT,
  ENTITY_COMMENT,
  ENTITY_SOURCED_COMMENT,
} from '../constants'

export function getEntityIDFromAction(action) {
  const key = getEntityIdKey(action.entity)
  return key ? action[key] : null
}

export function getEntityIdKey(entity) {
  switch (entity) {
    case ENTITY_VIDEO:
      return 'videoId'
    case ENTITY_SPEAKER:
      return 'speakerId'
    case ENTITY_STATEMENT:
      return 'statementId'
    case ENTITY_COMMENT:
      return 'commentId'
    case ENTITY_SOURCED_COMMENT:
      return 'commentId'
    default:
      return null
  }
}
