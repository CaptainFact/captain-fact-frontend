import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'

import { ENTITY_STATEMENT } from '../../../constants'
import { useVideoPlayback } from '../../../contexts/VideoPlaybackContext'
import ShareModal from '../../Utils/ShareModal'
import { ModalHistory } from '../../VideoDebate/ModalHistory'
import StatementHeader from '../StatementHeader'

const StatementV2 = ({
  statement,
  speaker,
  handleEdit,
  handleDelete,
  withoutActions,
  offset = 0,
  onSetScrollTo,
  t,
}) => {
  const { forcePosition } = useVideoPlayback()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)

  const handleTimeClick = (time) => {
    forcePosition(time)
    if (onSetScrollTo) {
      onSetScrollTo({
        id: statement.id,
        __forceAutoScroll: true,
      })
    }
  }

  const shareModal = () => {
    setShareModalOpen(true)
  }

  const showHistory = () => {
    setHistoryModalOpen(true)
  }

  return (
    <div data-cy="statement">
      <StatementHeader
        statementTime={statement.time + offset}
        isDraft={statement.isDraft}
        speaker={speaker}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleShowHistory={showHistory}
        handleTimeClick={withoutActions ? null : handleTimeClick}
        handleShare={shareModal}
        withoutActions={withoutActions}
      />
      <div className="bg-[#31455d] dark:bg-[hsl(210,30%,20%)] text-white dark:text-foreground p-5 shadow-inner flex items-start gap-4">
        <span className="h-[50px] -mt-2 sm:text-7xl text-5xl font-serif text-neutral-300 dark:text-neutral-400">
          “
        </span>
        <blockquote className="text-lg italic py-1">{statement.text}</blockquote>
      </div>
      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        path={`${location.pathname}?statement=${statement.id}`}
      />
      <ModalHistory
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        entity={ENTITY_STATEMENT}
        entityId={statement.id}
      />
    </div>
  )
}

export default withTranslation('videoDebate')(StatementV2)
