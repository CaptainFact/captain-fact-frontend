import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react'

const initialState = {
  position: 0,
  isPlaying: false,
  forcedPosition: { requestId: null, time: 0 },
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
    default:
      return state
  }
}

const VideoPlaybackContext = createContext(null)

export const VideoPlaybackProvider = ({ children, onUpdatePosition }) => {
  const [state, dispatch] = useReducer(playbackReducer, initialState)

  const setPosition = useCallback(
    (position) => {
      const truncatedPosition = Math.floor(position)
      if (truncatedPosition !== state.position) {
        dispatch({ type: 'SET_POSITION', payload: truncatedPosition })
        onUpdatePosition?.(truncatedPosition)
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

  const value = useMemo(
    () => ({
      position: state.position,
      isPlaying: state.isPlaying,
      forcedPosition: state.forcedPosition,
      setPosition,
      setPlaying,
      forcePosition,
    }),
    [state.position, state.isPlaying, state.forcedPosition, setPosition, setPlaying, forcePosition],
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
