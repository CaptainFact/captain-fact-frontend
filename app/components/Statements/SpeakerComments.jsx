import React from 'react'
import { withNamespaces } from 'react-i18next'

import VerificationsOriginHeader from './VerificationsOriginHeader'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'
import { CommentsList } from '../Comments/CommentsList'

export default withNamespaces('videoDebate')(({ t, speaker, comments }) => {
  return comments.size === 0 ? null : (
    <div className="self-comments columns is-gapless">
      <div className="column is-narrow">
        <VerificationsOriginHeader iconName="user" label={t('speaker.one')} />
        {speaker && <SpeakerPreview speaker={speaker} withoutActions />}
      </div>
      <div className="column">
        <CommentsList comments={comments} />
      </div>
    </div>
  )
})
