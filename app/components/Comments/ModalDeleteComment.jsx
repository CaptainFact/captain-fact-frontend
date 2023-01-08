import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'

import ModalConfirmDelete from '../Modal/ModalConfirmDelete'
import { CommentDisplay } from './CommentDisplay'

const ModalDeleteComment = ({ handleAbort, comment, replies, t, ...otherProps }) => (
  <ModalConfirmDelete
    handleAbort={handleAbort}
    title={t('comment.deleteThread', { count: replies && replies.size + 1 })}
    content={<CommentDisplay comment={comment} withoutActions />}
    {...otherProps}
  />
)

export default connect((state, props) => ({
  replies: state.VideoDebate.comments.replies.get(props.comment.id),
}))(withNamespaces('videoDebate')(ModalDeleteComment))
