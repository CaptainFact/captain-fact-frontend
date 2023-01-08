import React from 'react'
import { withNamespaces } from 'react-i18next'

import { CommentsList } from '../Comments/CommentsList'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'
import VerificationsOriginHeader from './VerificationsOriginHeader'

export default withNamespaces('videoDebate')(({ t, speaker, comments, setReplyToComment }) => {
  return comments.size === 0 ? null : (
    <div className="self-comments columns is-gapless">
      <div className="column is-narrow">
        <VerificationsOriginHeader iconName="user" label={t('speaker.one')} />
        {speaker && <SpeakerPreview speaker={speaker} withoutActions />}
      </div>
      <div className="column">
        <CommentsList comments={comments} setReplyToComment={setReplyToComment} />
      </div>
    </div>
  )
})
