import { Mic } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { CommentsList } from '../Comments/CommentsList'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'

export default withTranslation('videoDebate')(({ t, speaker, comments, setReplyToComment }) => {
  return comments.size === 0 ? null : (
    <div className="border-b border-gray-200">
      <div className="bg-neutral-100 text-center flex justify-center items-center gap-2 p-1 border-b border-gray-200">
        <Mic size={14} />
        {t('speaker.one')}
      </div>
      <div className="flex">
        <div className="bg-neutral-100 pl-2 pr-4 py-3 border-r border-gray-200">
          {speaker && <SpeakerPreview speaker={speaker} withoutActions />}
        </div>
        <div>
          <CommentsList comments={comments} setReplyToComment={setReplyToComment} />
        </div>
      </div>
    </div>
  )
})
