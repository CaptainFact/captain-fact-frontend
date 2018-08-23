import React from 'react'
import { connect } from 'react-redux'
import { translate, Interpolate } from 'react-i18next'
import { Link } from 'react-router'
import Popup from 'reactjs-popup'

import { hasReputation } from '../../state/users/current_user/selectors'
import { Icon } from './Icon'
import Message from './Message'


const mapStateToProps = (state, {requiredRep}) => ({
  hasReputation: hasReputation(state, requiredRep)
})

export const ReputationGuardTooltip = ({
  t,
  hasReputation,
  requiredRep,
  children,
  tooltipPosition = 'bottom center'
}) => {
  const childProps = {hasReputation}
  return hasReputation
    ? children(childProps)
    : (
      <Popup
        position={tooltipPosition}
        on="hover"
        trigger={(
          <div className="help-tooltip-trigger">{children(childProps)}</div>
        )}
      >
        <Message type="primary">
          <Icon name="info-circle"/>&nbsp;
          <Interpolate
            i18nKey="errors:client.needReputation"
            count={requiredRep}
            reputationLink={(
              <Link to="/help/reputation">
                {t('pages.reputation').toLowerCase()}
              </Link>
            )}
          />
        </Message>
      </Popup>
    )
}

export default connect(mapStateToProps)(translate('help')(ReputationGuardTooltip))
