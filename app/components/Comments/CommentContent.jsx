import { ChevronUp } from 'lucide-react'
import React from 'react'

import { Badge } from '../ui/badge'
import { Source } from './Source'

const COLLAPSE_CONTENT_ABOVE_NESTING = 6

const CommentContent = ({ comment: { source, text }, nesting, replyingTo, richMedias }) => {
  const isCollapsed = replyingTo && nesting > COLLAPSE_CONTENT_ABOVE_NESTING
  const shouldRenderTextBlock = text || isCollapsed

  return (
    <div>
      {shouldRenderTextBlock && (
        <div className="relative bg-white inline-block whitespace-pre-wrap border rounded py-1 px-2 text-sm break-words max-w-full">
          <ChevronUp
            size={20}
            className="absolute left-[2px] w-5 h-5 text-neutral-300 -top-[12px] fill-white stroke-1"
          />
          {isCollapsed && (
            <Badge variant="outline" className="mr-2">
              @{replyingTo.username}
            </Badge>
          )}
          {text}
        </div>
      )}
      {source && (
        <div>
          <Source withoutPlayer={!richMedias} source={source} />
        </div>
      )}
    </div>
  )
}

export default CommentContent
