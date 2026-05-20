import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react'

const initialState = {
  position: 0,
  isPlaying: false,
  forcedPosition: { requestId: null, time: 0 },
  volume: 1,
}

const playbackReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POSITION':
      return {
        ...state,
        position: action.payload,
      }
    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.payload,
      }
    case 'FORCE_POSITION':
      return {
        ...state,
        forcedPosition: { requestId: Date.now(), time: action.payload },
      }
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload,
      }
    default:
      return state
  }
}

const VideoPlaybackContext = createContext(null)

export const VideoPlaybackProvider = ({ children, onUpdatePosition }) => {
  const [state, dispatch] = useReducer(playbackReducer, initialState)

  // Always keep a ref to the latest onUpdatePosition so setPosition never
  // holds a stale closure. We can't put onUpdatePosition directly in
  // setPosition's deps because it is recreated on every parent render
  // (inline arrow function in VideoDebate), which would invalidate the
  // memoized context value and cause all consumers to re-render.
  const onUpdatePositionRef = useRef(onUpdatePosition)
  onUpdatePositionRef.current = onUpdatePosition

  const setPosition = useCallback(
    (position) => {
      const truncatedPosition = Math.floor(position)
      if (truncatedPosition !== state.position) {
        dispatch({ type: 'SET_POSITION', payload: truncatedPosition })
        onUpdatePositionRef.current?.(truncatedPosition)
      }
    },
    [state.position],
  )

  const setPlaying = useCallback((isPlaying) => {
    dispatch({ type: 'SET_PLAYING', payload: isPlaying })
  }, [])

  const forcePosition = useCallback((time) => {
    dispatch({ type: 'FORCE_POSITION', payload: time })
  }, [])

  const setVolume = useCallback(
    (volume) => {
      if (volume !== state.volume) {
        dispatch({ type: 'SET_VOLUME', payload: volume })
      }
    },
    [state.volume],
  )

  const value = useMemo(
    () => ({
      position: state.position,
      isPlaying: state.isPlaying,
      forcedPosition: state.forcedPosition,
      volume: state.volume,
      setPosition,
      setPlaying,
      forcePosition,
      setVolume,
    }),
    [state.position, state.isPlaying, state.forcedPosition, state.volume, setPosition, setPlaying, forcePosition, setVolume],
  )

  return <VideoPlaybackContext.Provider value={value}>{children}</VideoPlaybackContext.Provider>
}

export const useVideoPlayback = () => {
  const context = useContext(VideoPlaybackContext)
  if (!context) {
    throw new Error('useVideoPlayback must be used within a VideoPlaybackProvider')
  }
  return context
}
