import React, { useCallback, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'

import { useVideoPlayback } from '../../contexts/VideoPlaybackContext'

const getNormalizedPlayerVolume = (player) => {
  const internalPlayer = player?.getInternalPlayer?.()
  if (!internalPlayer) {
    return null
  }

  if (typeof internalPlayer.volume === 'number') {
    return internalPlayer.volume
  }

  if (typeof internalPlayer.getVolume === 'function') {
    const volume = internalPlayer.getVolume()
    if (Number.isFinite(volume)) {
      return volume > 1 ? volume / 100 : volume
    }
  }

  return null
}

/**
 * A player component with local state for position/playing.
 * Updates position when playing and seeks to position when requested.
 */
const VideoDebatePlayer = ({ url }) => {
  const { forcedPosition, isPlaying, setPlaying, setPosition, setVolume } = useVideoPlayback()
  const playerRef = useRef(null)
  const prevForcedPositionRef = useRef(null)
  const cleanupVolumeListenerRef = useRef(null)

  const updateVolumeFromPlayer = useCallback(() => {
    const volume = getNormalizedPlayerVolume(playerRef.current)
    if (volume !== null) {
      setVolume(volume)
    }
  }, [setVolume])

  const attachVolumeListener = useCallback(() => {
    cleanupVolumeListenerRef.current?.()

    const internalPlayer = playerRef.current?.getInternalPlayer?.()
    if (
      typeof internalPlayer?.volume !== 'number' ||
      typeof internalPlayer?.addEventListener !== 'function' ||
      typeof internalPlayer?.removeEventListener !== 'function'
    ) {
      cleanupVolumeListenerRef.current = null
      return
    }

    internalPlayer.addEventListener('volumechange', updateVolumeFromPlayer)
    cleanupVolumeListenerRef.current = () => {
      internalPlayer.removeEventListener('volumechange', updateVolumeFromPlayer)
    }
  }, [updateVolumeFromPlayer])

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

  useEffect(() => {
    return () => {
      cleanupVolumeListenerRef.current?.()
    }
  }, [])

  const handleReady = useCallback(() => {
    updateVolumeFromPlayer()
    attachVolumeListener()
  }, [attachVolumeListener, updateVolumeFromPlayer])

  const handleProgress = useCallback(
    ({ playedSeconds }) => {
      setPosition(playedSeconds)
      updateVolumeFromPlayer()
    },
    [setPosition, updateVolumeFromPlayer],
  )

  return (
    <ReactPlayer
      ref={playerRef}
      className="w-full aspect-video"
      url={url}
      playing={isPlaying}
      onReady={handleReady}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onProgress={handleProgress}
      width=""
      height=""
      controls
    />
  )
}

export default VideoDebatePlayer
