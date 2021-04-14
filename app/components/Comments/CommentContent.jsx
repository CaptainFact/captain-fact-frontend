import React from 'react'
import Tag from '../Utils/Tag'
import Source from './Source'

const COLLAPSE_CONTENT_ABOVE_NESTING = 6

const CommentContent = ({
  comment: { source, text },
  nesting,
  replyingTo,
  richMedias,
  withoutModalSource,
}) => {
  const isCollapsed = replyingTo && nesting > COLLAPSE_CONTENT_ABOVE_NESTING
  const shouldRenderTextBlock = text || isCollapsed

  return (
    <div>
      {shouldRenderTextBlock && (
        <div className="comment-text">
          {isCollapsed && <Tag style={{ marginRight: 5 }}>@{replyingTo.username}</Tag>}
          {text}
        </div>
      )}
      {source && (
        <Source
          withoutPlayer={!richMedias}
          source={source}
          withoutModalSource={withoutModalSource}
        />
      )}
    </div>
  )
}

export default CommentContent
