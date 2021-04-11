import React from 'react'
import { withNamespaces, Trans } from 'react-i18next'
import { Link } from 'react-router'
import Popup from 'reactjs-popup'

import { Icon } from './Icon'
import Message from './Message'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

export const ReputationGuardTooltip = ({
  t,
  checkReputation,
  requiredRep,
  children,
  tooltipPosition = 'bottom center',
}) => {
  return checkReputation(requiredRep) ? (
    children({ hasReputation: true })
  ) : (
    <Popup
      position={tooltipPosition}
      contentStyle={{ zIndex: 999, maxWidth: 250 }}
      on="hover"
      trigger={<div className="help-tooltip-trigger">{children({ hasReputation: false })}</div>}
    >
      <Message type="primary">
        <Icon name="info-circle" />
        &nbsp;
        <Trans i18nKey="errors:client.needReputation" requiredRep={requiredRep}>
          You need at least {{ requiredRep }}
          <Link to="/help/reputation">{t('pages.reputation').toLowerCase()}</Link>
          points to do that
        </Trans>
      </Message>
    </Popup>
  )
}

export default withNamespaces('help')(withLoggedInUser(ReputationGuardTooltip))
