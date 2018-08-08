import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Link } from 'react-router'

import { ENTITY_SPEAKER, ENTITY_VIDEO, ENTITY_STATEMENT } from '../../constants'
import { speakerURL, statementURL } from '../../lib/cf_routes'
import { videoHashIDFromContext } from '../../lib/actions_context'

/*
** An object of key: functions mapping entities types to URL generators.
** Functions signature must be (entityId, context) => URL
*/
const ENTITY_URL_MAPPER = {
  [ENTITY_SPEAKER]: speakerURL,
  [ENTITY_STATEMENT]: (entityID, context) => {
    const videoHashId = videoHashIDFromContext(context)
    if (!videoHashId)
      return null
    return statementURL(videoHashId, entityID)
  }
}

const EntityLink = ({t, entity, entityId, context, withPrefix}) => {
  if (!entityId)
    return t(`this.${entity}`)

  const urlGenerator = ENTITY_URL_MAPPER[entity]
  const url = urlGenerator && urlGenerator(entityId, context)
  const label = withPrefix ? `${t(`this.${entity}`)} #${entityId}` : `#${entityId}`
  return url ? (<Link to={url}>{label}</Link>) : label
}

EntityLink.propTypes = {
  entity: PropTypes.number.isRequired,
  entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  context: PropTypes.string,
  withPrefix: PropTypes.bool,
}

EntityLink.defaultProps = {
  withPrefix: true
}

export default translate('history')(EntityLink)
