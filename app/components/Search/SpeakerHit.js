import React from 'react'

import SpeakerPreviewV2 from '../Speakers/SpeakerPreviewV2'

export const SpeakerHit = ({ hit }) => {
  return (
    <div className="m-3">
      <SpeakerPreviewV2 speaker={hit} withoutActions />
    </div>
  )
}
