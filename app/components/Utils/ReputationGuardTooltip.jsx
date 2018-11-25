import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces, Trans } from 'react-i18next'
import { Link } from 'react-router'
import Popup from 'reactjs-popup'

import { hasReputation } from '../../state/users/current_user/selectors'
import { Icon } from './Icon'
import Message from './Message'

const mapStateToProps = (state, { requiredRep }) => ({
  hasReputation: hasReputation(state, requiredRep)
})

const POPUP_STYLE = {
  zIndex: 999
}

const ARROW_STYLE = {
  background: '#f9fbfb'
}

export const ReputationGuardTooltip = ({
  t,
  hasReputation,
  requiredRep,
  children,
  tooltipPosition = 'bottom center'
}) => {
  const childProps = { hasReputation }
  return hasReputation ? (
    children(childProps)
  ) : (
    <Popup
      position={tooltipPosition}
      contentStyle={POPUP_STYLE}
      arrowStyle={ARROW_STYLE}
      on="hover"
      trigger={
        <div className="help-tooltip-trigger">{children(childProps)}</div>
      }
    >
      <Message type="primary">
        <Icon name="info-circle" />
        &nbsp;
        <Trans i18nKey="errors:client.needReputation" requiredRep={requiredRep}>
          You need at least {{ requiredRep }}
          <Link to="/help/reputation">
            {t('pages.reputation').toLowerCase()}
          </Link>
          points to do that
        </Trans>
      </Message>
    </Popup>
  )
}

export default connect(mapStateToProps)(
  withNamespaces('help')(ReputationGuardTooltip)
)
