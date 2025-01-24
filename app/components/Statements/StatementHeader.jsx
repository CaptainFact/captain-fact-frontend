import React from 'react'
import { withTranslation } from 'react-i18next'
import Popup from 'reactjs-popup'
import { InfoCircle } from 'styled-icons/fa-solid'

import Message from '../Utils/Message'
import TimeDisplay from '../Utils/TimeDisplay'
import { StatementDropdownMenu } from './StatementDropdownMenu'

export default withTranslation('videoDebate')(
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
    customButtons = null,
  }) => (
    <header className="flex items-center justify-between border-b border-gray-200 p-3">
      <div className="flex items-center">
        <div className="mr-2 min-w-[60px] border-r border-gray-200 pr-2.5 text-gray-600 font-medium">
          <TimeDisplay
            time={statementTime}
            handleClick={handleTimeClick}
            textClassName="sm:text-sm text-xs"
          />
        </div>
        {isDraft && (
          <Popup
            contentStyle={{ zIndex: 999, maxWidth: 350 }}
            on="hover"
            trigger={
              <div className="mr-2">
                <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                  <span className="mr-1">{t('statement.draft')}</span>
                  <InfoCircle size={12} />
                </span>
              </div>
            }
          >
            <Message type="dark">{t('statement.draftDetails')}</Message>
          </Popup>
        )}
        {speaker && speaker.picture && (
          <img className="mr-1.5 h-6 w-6 rounded-full" src={speaker.picture} alt="" />
        )}
        <strong className="sm:text-base text-xs mr-1">{speaker ? speaker.full_name : ''}</strong>
      </div>
      <div className="flex items-center gap-2">
        {customButtons}
        {!withoutActions && (
          <StatementDropdownMenu
            isDraft={isDraft}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleShowHistory={handleShowHistory}
            handleShare={handleShare}
          />
        )}
      </div>
    </header>
  ),
)
