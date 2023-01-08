import React from 'react'
import { withNamespaces } from 'react-i18next'
import { Link } from 'react-router-dom'

import {
  ENTITY_COMMENT,
  ENTITY_SOURCED_COMMENT,
  ENTITY_SPEAKER,
  ENTITY_STATEMENT,
  ENTITY_VIDEO,
} from '../../constants'
import { commentURL, speakerURL, statementURL, videoURL } from '../../lib/cf_routes'

const comment_mapper = ({ videoHashId, statementId, commentId }) => {
  return [commentId, commentURL(videoHashId, statementId, commentId)]
}

/*
 ** An object of key: functions mapping entities types to URL generators.
 ** Functions signature must be (entityId, context) => [entityId, URL]
 */
const ENTITY_DISPLAY_MAPPER = {
  [ENTITY_VIDEO]: ({ videoHashId }) => [videoHashId, videoURL(videoHashId)],
  [ENTITY_SPEAKER]: ({ speakerId }) => [speakerId, speakerURL(speakerId)],
  [ENTITY_STATEMENT]: ({ videoHashId, statementId }) => {
    return [statementId, statementURL(videoHashId, statementId)]
  },
  [ENTITY_COMMENT]: comment_mapper,
  [ENTITY_SOURCED_COMMENT]: comment_mapper,
}

const ActionEntityLink = ({ t, action }) => {
  const label = t(`entities.${action.entity}`)
  const entityLinker = ENTITY_DISPLAY_MAPPER[action.entity]
  if (!entityLinker) {
    return label
  }

  const [entityId, url] = entityLinker(action)
  const full_label = entityId ? `${label} #${entityId}` : label
  return url ? <Link to={url}>{full_label}</Link> : full_label
}

export default withNamespaces('history')(ActionEntityLink)
