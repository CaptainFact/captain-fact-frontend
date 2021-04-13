import React from 'react'
import { withNamespaces } from 'react-i18next'
import TimeDisplay from '../Utils/TimeDisplay'
import ClickableIcon from '../Utils/ClickableIcon'
import { MIN_REPUTATION_UPDATE_STATEMENT, MIN_REPUTATION_REMOVE_STATEMENT } from '../../constants'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'
import { Box } from '@rebass/grid'

export default withNamespaces('videoDebate')(
  ({
    t,
    statementTime,
    speaker,
    handleTimeClick,
    handleShowHistory,
    handleEdit,
    handleShare,
    handleDelete,
    withoutActions,
  }) => (
    <header className="card-header">
      <div className="card-header-title">
        <Box mr={2}>
          <TimeDisplay time={statementTime} handleClick={handleTimeClick} />
        </Box>
        {speaker && speaker.picture && (
          <img className="speaker-mini" src={speaker.picture} alt="" />
        )}
        <strong>{speaker ? speaker.full_name : ''}</strong>
      </div>
      {!withoutActions && (
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
      )}
    </header>
  )
)
