import React, { useCallback, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'

import { useVideoPlayback } from '../../contexts/VideoPlaybackContext'

/**
 * A player component with local state for position/playing.
 * Updates position when playing and seeks to position when requested.
 */
const VideoDebatePlayer = ({ url }) => {
  const { forcedPosition, isPlaying, setPosition, setPlaying, setVolume } = useVideoPlayback()
  const playerRef = useRef(null)
  const prevForcedPositionRef = useRef(null)
  const internalPlayerRef = useRef(null)
  const volumeListenerRef = useRef(null)

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

  // Read the current volume from the internal player and sync it to context.
  // Supports both HTML5 <video> (player.volume, 0–1) and YouTube iframe API
  // (player.getVolume(), 0–100). Only dispatches when the value changes.
  const syncVolume = useCallback(() => {
    const player = playerRef.current?.getInternalPlayer()
    if (!player) return

    let vol
    if (typeof player.getVolume === 'function') {
      vol = player.isMuted?.() ? 0 : player.getVolume() / 100
    } else if (typeof player.volume === 'number') {
      vol = player.muted ? 0 : player.volume
    } else {
      return
    }

    setVolume(Math.max(0, Math.min(1, vol)))
  }, [setVolume])

  // Keep a stable ref to the latest syncVolume so the native DOM listener
  // always calls the current version without needing to re-register on each
  // render (avoids the stale-closure / repeated add-remove cycle).
  const syncVolumeRef = useRef(syncVolume)
  syncVolumeRef.current = syncVolume

  // On player ready: sync initial volume and attach a native volumechange
  // listener so that volume changes while the video is paused are captured
  // immediately (works for HTML5 video; YouTube provides no equivalent event).
  const handleReady = useCallback(() => {
    syncVolumeRef.current()
    const player = playerRef.current?.getInternalPlayer()
    if (player?.addEventListener) {
      volumeListenerRef.current = () => syncVolumeRef.current()
      player.addEventListener('volumechange', volumeListenerRef.current)
      internalPlayerRef.current = player
    }
  }, [])

  useEffect(() => {
    return () => {
      if (internalPlayerRef.current && volumeListenerRef.current) {
        internalPlayerRef.current.removeEventListener('volumechange', volumeListenerRef.current)
      }
    }
  }, [])

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
        syncVolume()
      }}
      onReady={handleReady}
      width=""
      height=""
      controls
    />
  )
}

export default VideoDebatePlayer
