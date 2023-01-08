import React from 'react'
import { withNamespaces } from 'react-i18next'
import { Link } from 'react-router-dom'

import { MIN_REPUTATION_ADD_VIDEO } from '../../constants'
import { Icon } from '../Utils/Icon'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'

const AddVideoBtn = ({ t }) => {
  return (
    <ReputationGuardTooltip requiredRep={MIN_REPUTATION_ADD_VIDEO}>
      {({ hasReputation }) => (
        <Link to="/videos/add" className="button is-primary" disabled={!hasReputation}>
          <Icon name="plus-circle" />
          <span>{t('videos.add')}</span>
        </Link>
      )}
    </ReputationGuardTooltip>
  )
}

export default withNamespaces('main')(AddVideoBtn)
