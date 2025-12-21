import { useMutation } from '@apollo/client'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Mic } from 'lucide-react'
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'

import { toast } from '@/hooks/use-toast'

import { REMOVE_SPEAKER_FROM_VIDEO_MUTATION } from '../../API/graphql_queries'
import DialogConfirmDelete from '../Dialogs/DialogConfirmDelete'
import { Avatar, AvatarImage } from '../ui/avatar'
import EditSpeakerFormModal from './EditSpeakerFormModal'
import { SpeakerDropdownMenu } from './SpeakerDropdownMenu'

const SpeakerPreviewV2 = ({
  speaker,
  className,
  videoId,
  isAuthenticated = false,
  showActions = true,
  onSetStatementForm,
  t,
}) => {
  const history = useHistory()
  const [removeSpeakerFromVideo] = useMutation(REMOVE_SPEAKER_FROM_VIDEO_MUTATION)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  if (!speaker) {
    return null
  }

  const handleRemoveSpeaker = () => {
    setDeleteModalOpen(true)
  }

  const handleConfirmRemoveSpeaker = async () => {
    await removeSpeakerFromVideo({
      variables: { videoId, speakerId: speaker.id },
    })
    toast({
      title: t('speaker.remove'),
      description: t('speaker.confirmRemove', { speaker }),
    })
    setDeleteModalOpen(false)
  }

  const handleEditSpeaker = () => {
    setEditModalOpen(true)
  }

  const handleAddStatement = () => {
    // Navigate to debate view if we're on history page
    const currentPath = window.location.pathname
    const historyRegex = new RegExp('/history/?$')
    if (currentPath.match(historyRegex)) {
      history.push(currentPath.replace(historyRegex, ''))
    }

    // Set the statement form with the speaker
    if (onSetStatementForm) {
      onSetStatementForm({ speakerId: speaker.id })
    }
  }

  const mainContent = (
    <div className={`flex items-center justify-between gap-2 animate-fadeInUp ${className || ''}`}>
      <div className="flex items-center">
        <div className="flex-none w-[50px] flex justify-center items-center mr-3">
          <Avatar className="bg-white dark:bg-background rounded-full flex items-center justify-center border border-neutral-200 dark:border-border">
            <AvatarImage src={speaker.picture} />
            <AvatarFallback>
              <Mic className="text-neutral-600 dark:text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <Link
            to={`/s/${speaker.slug || speaker.id}`}
            className="sm:font-medium sm:text-base text-sm hover:underline text-neutral-900 dark:text-foreground"
            target="_blank"
          >
            {speaker.fullName}
          </Link>
          <p className="sm:text-sm max-w-full text-xs text-neutral-600 dark:text-muted-foreground">
            {speaker.title || '...'}
          </p>
        </div>
      </div>
      <div className="flex">
        {isAuthenticated && showActions && (
          <SpeakerDropdownMenu
            handleRemove={handleRemoveSpeaker}
            handleEdit={handleEditSpeaker}
            handleAddStatement={handleAddStatement}
          />
        )}
      </div>
    </div>
  )

  return (
    <>
      {mainContent}
      <EditSpeakerFormModal
        speaker={speaker}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
      <DialogConfirmDelete
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={t('speaker.remove')}
        message={t('speaker.confirmRemove', { speaker })}
        handleConfirm={handleConfirmRemoveSpeaker}
        isRemove
      />
    </>
  )
}

export default withTranslation('videoDebate')(SpeakerPreviewV2)


