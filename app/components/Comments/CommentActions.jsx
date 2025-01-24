import { Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

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
  <div className="mt-2">
    <div className="flex flex-wrap items-center gap-1">
      {isOwnComment ? (
        <OwnCommentActions handleAddToThread={handleReply} handleDelete={handleDelete} />
      ) : (
        <OtherCommentActions
          handleReply={handleReply}
          handleFlag={handleFlag}
          isFlagged={isFlagged}
        />
      )}
    </div>
    {nbReplies !== 0 && (
      <CommentAction
        variant="outline"
        title={t('comment.replies', {
          context: repliesCollapsed ? 'show' : 'hide',
          count: nbReplies,
        })}
        className="mt-1"
        iconName={repliesCollapsed ? 'eye' : 'eye-slash'}
        icon={repliesCollapsed ? <Eye size="1em" /> : <EyeOff size="1em" />}
        onClick={handleToggleShowReplies}
      />
    )}
  </div>
)

export default withTranslation('videoDebate')(CommentActions)
