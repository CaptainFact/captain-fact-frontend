import React from 'react'
import { withNamespaces } from 'react-i18next'

import CommentAction from './CommentAction'
import OtherCommentActions from './OtherCommentActions'
import OwnCommentActions from './OwnCommentActions'

const CommentActions = ({
  t,
  isOwnComment,
  isFlagged,
  nbReplies,
  repliesCollapsed,
  handleReply,
  handleDelete,
  handleFlag,
  handleToggleShowReplies,
}) => (
  <nav className="comment-actions">
    {isOwnComment ? (
      <OwnCommentActions handleAddToThread={handleReply} handleDelete={handleDelete} />
    ) : (
      <OtherCommentActions
        handleReply={handleReply}
        handleFlag={handleFlag}
        isFlagged={isFlagged}
      />
    )}
    {nbReplies !== 0 && (
      <CommentAction
        title={t('comment.replies', {
          context: repliesCollapsed ? 'show' : 'hide',
          count: nbReplies,
        })}
        iconName={repliesCollapsed ? 'eye' : 'eye-slash'}
        onClick={handleToggleShowReplies}
      />
    )}
  </nav>
)

export default withNamespaces('videoDebate')(CommentActions)
