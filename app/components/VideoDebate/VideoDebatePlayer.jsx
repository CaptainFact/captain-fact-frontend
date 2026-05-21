import React, { useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'

import { useVideoPlayback } from '../../contexts/VideoPlaybackContext'
import { getReactPlayerVolume } from '../../lib/player_volume'

/**
 * A player component with local state for position/playing.
 * Updates position when playing and seeks to position when requested.
 */
const VideoDebatePlayer = ({ url }) => {
  const { forcedPosition, isPlaying, setPosition, setPlaying, setVolume } = useVideoPlayback()
  const playerRef = useRef(null)
  const prevForcedPositionRef = useRef(null)

  const updateVolumeFromPlayer = () => {
    const volume = getReactPlayerVolume(playerRef.current)
    if (volume !== null) {
      setVolume(volume)
    }
  }

  useEffect(() => {
    if (
      playerRef.current &&
      forcedPosition.requestId !== null &&
      forcedPosition.requestId !== prevForcedPositionRef.current
    ) {
      setPlaying(true)
      playerRef.current.seekTo(forcedPosition.time)
      prevForcedPositionRef.current = forcedPosition.requestId
    }
  }, [forcedPosition, setPlaying])

  return (
    <ReactPlayer
      ref={playerRef}
      className="w-full aspect-video"
      url={url}
      playing={isPlaying}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onProgress={({ playedSeconds }) => {
        setPosition(playedSeconds)
        updateVolumeFromPlayer()
      }}
      width=""
      height=""
      controls
    />
  )
}

export default VideoDebatePlayer
