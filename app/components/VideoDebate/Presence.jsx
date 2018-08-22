import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { Icon } from '../Utils'
import Tag from '../Utils/Tag'


const Presence = ({t, nbUsers, nbViewers}) => (
  <div className="presence">
    <Tag type="primary">
      <Icon size="small" name="group"/>
      <span>{t('presence.user', {count: nbUsers})}</span>
    </Tag>
    <Tag className="viewers">
      <Icon size="small" name="eye"/>
      <span>{t('presence.viewer', {count: nbViewers})}</span>
    </Tag>
  </div>
)

Presence.propTypes = {
  nbUsers: PropTypes.number.isRequired,
  nbViewers: PropTypes.number.isRequired,
}

export default translate('videoDebate')(Presence)
