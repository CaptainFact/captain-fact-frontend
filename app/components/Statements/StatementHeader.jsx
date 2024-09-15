import { Box } from '@rebass/grid'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import Popup from 'reactjs-popup'
import { InfoCircle } from 'styled-icons/fa-solid'

import { MIN_REPUTATION_REMOVE_STATEMENT, MIN_REPUTATION_UPDATE_STATEMENT } from '../../constants'
import ClickableIcon from '../Utils/ClickableIcon'
import Message from '../Utils/Message'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'
import Tag from '../Utils/Tag'
import TimeDisplay from '../Utils/TimeDisplay'

export default withNamespaces('videoDebate')(
  ({
    t,
    statementTime,
    isDraft,
    speaker,
    handleTimeClick,
    handleShowHistory,
    handleEdit,
    handleShare,
    handleDelete,
    withoutActions,
    customButtons,
  }) => (
    <header className="card-header">
      <div className="card-header-title">
        <Box mr={2}>
          <TimeDisplay time={statementTime} handleClick={handleTimeClick} />
        </Box>
        {isDraft && (
          <Popup
            contentStyle={{ zIndex: 999, maxWidth: 350 }}
            on="hover"
            trigger={
              <div className="mr-2">
                <Tag type="warning" size="small">
                  <span className="mr-1"> {t('statement.draft')}</span>
                  <InfoCircle size={12} />
                </Tag>
              </div>
            }
          >
            <Message type="dark">{t('statement.draftDetails')}</Message>
          </Popup>
        )}
        {speaker && speaker.picture && (
          <img className="speaker-mini" src={speaker.picture} alt="" />
        )}
        <strong>{speaker ? speaker.full_name : ''}</strong>
      </div>
      {(!withoutActions || customButtons) && (
        <div className="card-header-icon">
          {!withoutActions && (
            <React.Fragment>
              {!isDraft && (
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
              )}
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
              {!isDraft && (
                <React.Fragment>
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
                </React.Fragment>
              )}
            </React.Fragment>
          )}

          {customButtons || null}
        </div>
      )}
    </header>
  ),
)
