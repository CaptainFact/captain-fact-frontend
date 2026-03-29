import React from 'react'

import SpeakerPreview from '../Speakers/SpeakerPreview'

export const SpeakerHit = ({ hit }) => {
  return (
    <div className="m-3">
      <SpeakerPreview
        withoutActions
        speaker={{
          ...hit,
          fullName: hit.full_name,
          wikidataItemId: hit.wikidata_item_id,
        }}
      />
    </div>
  )
}
