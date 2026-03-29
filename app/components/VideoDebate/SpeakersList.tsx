import React from 'react'

import { useFocusedStatement } from 'app/contexts/FocusedStatementContext'

import SpeakerPreview from '../Speakers/SpeakerPreview'

export const SpeakersList = ({ speakers, videoId, isAuthenticated, onSetStatementForm }) => {
  const { statement } = useFocusedStatement()
  return speakers.map((speaker) => (
    <SpeakerPreview
      key={speaker.id}
      speaker={speaker}
      videoId={videoId}
      isAuthenticated={isAuthenticated}
      onSetStatementForm={onSetStatementForm}
      isAnimated={statement?.speaker?.id === speaker.id}
    />
  ))
}
