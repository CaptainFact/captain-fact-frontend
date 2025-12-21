import React from 'react'
import { useTranslation } from 'react-i18next'

import DialogConfirmDelete from '../Dialogs/DialogConfirmDelete'
import CommentDisplay from './CommentDisplay'

const ModalDeleteComment = ({ handleAbort, comment, replies = [], ...otherProps }) => {
  const { t } = useTranslation('videoDebate')
  const repliesCount = Array.isArray(replies) ? replies.length : 0

  return (
    <DialogConfirmDelete
      handleAbort={handleAbort}
      title={t('comment.deleteThread', { count: repliesCount + 1 })}
      content={<CommentDisplay comment={comment} withoutActions />}
      {...otherProps}
    />
  )
}

export default ModalDeleteComment
