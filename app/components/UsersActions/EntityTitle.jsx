import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Link } from 'react-router'

import { ENTITY_SPEAKER, ENTITY_VIDEO } from '../../constants'


@translate('history')
class EntityTitle extends PureComponent {
  render() {
    const {t, entity, entityId, withPrefix} = this.props
    let label = null

    if (!entityId)
      return null
    if (entity === ENTITY_VIDEO)
      return t(`this.${entity}`)
    if (withPrefix)
      label = t(`this.${entity}`) + ` #${entityId}`
    else
      label = `#${entityId}`
    if (entity === ENTITY_SPEAKER)
      return <Link to={`/s/${entityId}`}>{label}</Link>
    return label
  }
}

EntityTitle.propTypes = {
  entity: PropTypes.number.isRequired,
  entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  withPrefix: PropTypes.bool,
}

EntityTitle.defaultProps = {
  withPrefix: true
}

export default EntityTitle
