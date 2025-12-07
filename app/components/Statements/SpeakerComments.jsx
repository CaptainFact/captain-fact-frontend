import { Mic } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { CommentsList } from '../Comments/CommentsList'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'

export default withTranslation('videoDebate')(({ t, speaker, comments, setReplyToComment, repliesByParent }) => {
  // Normalize comments to array - handles both arrays and Immutable-like objects
  const commentsArray = Array.isArray(comments) 
    ? comments 
    : (comments?.toArray ? comments.toArray() : (comments?.size ? Array.from({ length: comments.size }, (_, i) => comments.get(i)) : []))
  const commentsLength = commentsArray.length
  
  return commentsLength === 0 ? null : (
    <div className="border-b border-gray-200 dark:border-border">
      <div className="bg-neutral-100 dark:bg-accent text-center flex justify-center items-center gap-2 p-1 border-b border-gray-200 dark:border-border dark:text-foreground">
        <Mic size={14} />
        {t('speaker.one')}
      </div>
      <div className="flex">
        <div className="bg-neutral-100 dark:bg-accent pl-2 pr-4 py-3 border-r border-gray-200 dark:border-border">
          {speaker && <SpeakerPreview speaker={speaker} withoutActions />}
        </div>
        <div>
          <CommentsList comments={commentsArray} setReplyToComment={setReplyToComment} repliesByParent={repliesByParent} />
        </div>
      </div>
    </div>
  )
})
