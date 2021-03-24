import React from 'react'
import { VideoCard } from '../Videos/VideoCard'

export const VideoHit = ({ hit }) => {
  return (
    <VideoCard
      video={{
        ...hit,
        hashId: hit.hash_id,
        thumbnail: `https://img.youtube.com/vi/${hit.youtube_id}/mqdefault.jpg`,
        isPartner: hit.is_partner,
        youtubeId: hit.youtube_id,
      }}
    />
  )
}
