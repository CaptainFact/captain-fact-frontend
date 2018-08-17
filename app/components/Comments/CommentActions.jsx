import React from 'react'
import { translate } from 'react-i18next'

import OwnCommentActions from './OwnCommentActions'
import OtherCommentActions from './OtherCommentActions'
import CommentAction from './CommentAction'

const CommentActions = ({
  t,
  isOwnComment,
  nbReplies,
  repliesCollapsed,
  handleReply,
  handleDelete,
  handleFlag,
  handleToggleShowReplies
}) => (
  <nav className="comment-actions">
    { isOwnComment
      ? (
        <OwnCommentActions
          handleAddToThread={handleReply}
          handleDelete={handleDelete}
        />
      ) : (
        <OtherCommentActions
          handleReply={handleReply}
          handleFlag={handleFlag}
        />
      )
    }
    {nbReplies !== 0 && (
      <CommentAction
        title={t('comment.replies', {
          context: repliesCollapsed ? 'show' : 'hide',
          count: nbReplies
        })}
        iconName={repliesCollapsed ? 'eye' : 'eye-slash'}
        onClick={handleToggleShowReplies}
      />
    )}
  </nav>
)

export default translate('videoDebate')(CommentActions)
