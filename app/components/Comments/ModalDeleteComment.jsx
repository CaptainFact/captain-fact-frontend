import React from 'react'
import { useTranslation } from 'react-i18next'

import DialogConfirmDelete from '../Dialogs/DialogConfirmDelete'
import CommentDisplayV2 from './CommentDisplay'

const ModalDeleteCommentV2 = ({ handleAbort, comment, replies = [], ...otherProps }) => {
  const { t } = useTranslation('videoDebate')
  const repliesCount = Array.isArray(replies) ? replies.length : 0

  return (
    <DialogConfirmDelete
      handleAbort={handleAbort}
      title={t('comment.deleteThread', { count: repliesCount + 1 })}
      content={<CommentDisplayV2 comment={comment} withoutActions />}
      {...otherProps}
    />
  )
}

export default ModalDeleteCommentV2
