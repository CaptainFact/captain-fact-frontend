import React from 'react'
import { withNamespaces } from 'react-i18next'
import TimeDisplay from '../Utils/TimeDisplay'
import ClickableIcon from '../Utils/ClickableIcon'
import {
  MIN_REPUTATION_UPDATE_STATEMENT,
  MIN_REPUTATION_REMOVE_STATEMENT
} from '../../constants'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'

export default withNamespaces('videoDebate')(
  ({
    t,
    statement,
    speaker,
    handleTimeClick,
    handleShowHistory,
    handleEdit,
    handleShare,
    handleDelete
  }) => (
    <header className="card-header">
      <p className="card-header-title">
        <TimeDisplay time={statement.time} handleClick={handleTimeClick} />
        {speaker && speaker.picture && (
          <img className="speaker-mini" src={speaker.picture} alt="" />
        )}
        <strong>{speaker ? speaker.full_name : ''}</strong>
      </p>
      <div className="card-header-icon">
        <ReputationGuardTooltip
          requiredRep={MIN_REPUTATION_REMOVE_STATEMENT}
          tooltipPosition="left center"
        >
          {({ hasReputation }) => (
            <ClickableIcon
              name="times"
              size="action-size"
              title={t('main:actions.remove')}
              onClick={handleDelete}
              disabled={!hasReputation}
            />
          )}
        </ReputationGuardTooltip>
        <ReputationGuardTooltip
          requiredRep={MIN_REPUTATION_UPDATE_STATEMENT}
          tooltipPosition="left center"
        >
          {({ hasReputation }) => (
            <ClickableIcon
              name="pencil"
              size="action-size"
              title={t('main:actions.edit')}
              onClick={handleEdit}
              disabled={!hasReputation}
            />
          )}
        </ReputationGuardTooltip>
        <ClickableIcon
          name="history"
          size="action-size"
          title={t('history')}
          onClick={handleShowHistory}
        />
        <ClickableIcon
          name="share-alt"
          size="action-size"
          title={t('main:actions.share')}
          onClick={handleShare}
        />
      </div>
    </header>
  )
)
