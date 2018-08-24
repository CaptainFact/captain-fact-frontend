import React from 'react'
import { translate } from 'react-i18next'

import VerificationsOriginHeader from './VerificationsOriginHeader'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'
import { CommentsList } from '../Comments/CommentsList'


export default translate('videoDebate')(({t, speaker, comments}) => {
  return comments.size === 0 ? null : (
    <div className="self-comments columns is-gapless">
      <div className="column is-narrow">
        <VerificationsOriginHeader iconName="user" label={t('speaker.one')} />
        <SpeakerPreview speaker={speaker} withoutActions/>
      </div>
      <div className="column">
        <CommentsList comments={comments}/>
      </div>
    </div>
  )
})
