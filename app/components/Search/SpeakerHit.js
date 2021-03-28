import React from 'react'
import { Box } from '@rebass/grid'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'

export const SpeakerHit = ({ hit }) => {
  return (
    <Box m={3}>
      <SpeakerPreview withoutActions speaker={hit} />
    </Box>
  )
}
