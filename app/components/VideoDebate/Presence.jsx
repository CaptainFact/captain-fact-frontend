import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { Badge } from '../ui/badge'

const Presence = ({ t, nbUsers, nbViewers }) => (
  <div className="presence">
    <Badge>
      <span>{t('presence.user', { count: nbUsers })}</span>
    </Badge>
    <Badge variant="outline">
      <span>{t('presence.viewer', { count: nbViewers })}</span>
    </Badge>
  </div>
)

Presence.propTypes = {
  nbUsers: PropTypes.number.isRequired,
  nbViewers: PropTypes.number.isRequired,
}

export default withTranslation('videoDebate')(Presence)
