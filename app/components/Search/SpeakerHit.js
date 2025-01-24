import React from 'react'

import { SpeakerPreview } from '../Speakers/SpeakerPreview'

export const SpeakerHit = ({ hit }) => {
  return (
    <div className="m-3">
      <SpeakerPreview withoutActions speaker={hit} />
    </div>
  )
}
