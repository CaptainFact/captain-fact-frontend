import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { CommentDisplay } from './CommentDisplay'
import ModalConfirmDelete from '../Modal/ModalConfirmDelete'


const ModalDeleteComment = ({handleAbort, comment, replies, t, ...otherProps}) => (
  <ModalConfirmDelete
    handleAbort={handleAbort}
    title={t('comment.deleteThread', {count: replies && replies.size + 1})}
    content={(<CommentDisplay comment={comment} withoutActions/>)}
    {...otherProps}
  />
)

export default
connect((state, props) => ({
  replies: state.VideoDebate.comments.replies.get(props.comment.id)})
)(translate('videoDebate')(ModalDeleteComment))
