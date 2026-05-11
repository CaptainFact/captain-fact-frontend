import React, { useCallback, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'

import { useVideoPlayback } from '../../contexts/VideoPlaybackContext'

const VOLUME_SYNC_INTERVAL = 2000

export const readInternalPlayerVolume = (player) => {
  if (!player) {
    return null
  }

  if (typeof player.isMuted === 'function' && player.isMuted()) {
    return 0
  }

  if (player.muted === true) {
    return 0
  }

  if (typeof player.getVolume === 'function') {
    const volume = player.getVolume()
    if (typeof volume === 'number' && !Number.isNaN(volume)) {
      return volume > 1 ? volume / 100 : volume
    }
  }

  if (typeof player.volume === 'number' && !Number.isNaN(player.volume)) {
    return player.volume
  }

  return null
}

/**
 * A player component with local state for position/playing.
 * Updates position when playing and seeks to position when requested.
 */
const VideoDebatePlayer = ({ url }) => {
  const { forcedPosition, isPlaying, setPosition, setPlaying, setVolume } = useVideoPlayback()
  const playerRef = useRef(null)
  const prevForcedPositionRef = useRef(null)

  const syncPlayerVolume = useCallback(() => {
    const player = playerRef.current?.getInternalPlayer?.()
    const volume = readInternalPlayerVolume(player)

    if (volume !== null) {
      setVolume(volume)
    }
  }, [setVolume])

  useEffect(() => {
    const intervalId = window.setInterval(syncPlayerVolume, VOLUME_SYNC_INTERVAL)
    return () => window.clearInterval(intervalId)
  }, [syncPlayerVolume])

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
      onReady={syncPlayerVolume}
      onPlay={() => {
        setPlaying(true)
        syncPlayerVolume()
      }}
      onPause={() => {
        setPlaying(false)
        syncPlayerVolume()
      }}
      onProgress={({ playedSeconds }) => {
        setPosition(playedSeconds)
        syncPlayerVolume()
      }}
      width=""
      height=""
      controls
    />
  )
}

export default VideoDebatePlayer
