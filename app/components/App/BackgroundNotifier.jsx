import React, { useCallback, useEffect, useRef } from 'react'
import Tinycon from 'tinycon'

import confirmSoundFileURL from '../../assets/sounds/background_statement_confirm.mp3'
import neutralSoundFileURL from '../../assets/sounds/background_statement_neutral.mp3'
import refuteSoundFileURL from '../../assets/sounds/background_statement_refute.mp3'
import { STATEMENT_FOCUS_TIME } from '../../constants'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { useVideoPlayback } from '../../contexts/VideoPlaybackContext'
import { isStatementConfirmed } from '../../lib/statements_utils'

const confirmAudioFile = new Audio(confirmSoundFileURL)
const refuteAudioFile = new Audio(refuteSoundFileURL)
const neutralAudioFile = new Audio(neutralSoundFileURL)

/**
 * This component watches for various events then triggers sounds or change
 * favicon to notify the user that there's something to look at **only**
 * when the current window doesn't have the focus.
 */
const BackgroundNotifier = ({ statements, videoOffset = 0 }) => {
  const { position } = useVideoPlayback()
  const { enableSoundOnBackgroundFocus: soundEnabled } = useUserPreferences()
  const prevFocusedStatementIdRef = useRef(-1)
  const prevSoundEnabledRef = useRef(soundEnabled)

  // Calculate focused statement ID based on current position
  const focusedStatementId = React.useMemo(() => {
    if (!position || !statements) {
      return -1
    }
    const adjustedPosition = position - videoOffset
    const statement = statements.findLast((st) => adjustedPosition >= st.time)
    return statement && adjustedPosition <= statement.time + STATEMENT_FOCUS_TIME
      ? statement.id
      : -1
  }, [position, statements, videoOffset])

  // Get comments for the focused statement
  const comments = React.useMemo(() => {
    if (focusedStatementId === -1 || !statements) {
      return []
    }
    const statement = statements.find((st) => st.id === focusedStatementId)
    return statement?.comments || []
  }, [focusedStatementId, statements])

  const setFavicon = useCallback((value) => {
    // Reset favicon URL each time we interact with it to fix ugly background
    // See https://github.com/tommoor/tinycon/issues/85#issuecomment-244999536
    Tinycon.setImage('/favicons/favicon-32x32.png')
    Tinycon.setBubble(value)
  }, [])

  const onFocus = useCallback(() => {
    setFavicon(null)
  }, [setFavicon])

  // Initialize Tinycon options
  useEffect(() => {
    Tinycon.setOptions({
      background: 'transparent',
      fallback: false,
    })
  }, [])

  // Handle focus event listener
  useEffect(() => {
    const focusEventListener = window.addEventListener('focus', onFocus)
    return () => {
      if (focusEventListener) {
        window.removeEventListener('focus', focusEventListener)
      }
    }
  }, [onFocus])

  // Handle sound enable/disable and statement focus changes
  useEffect(() => {
    // Play a sound when enabling setting
    if (!prevSoundEnabledRef.current && soundEnabled) {
      neutralAudioFile.play()
      prevSoundEnabledRef.current = soundEnabled
      return
    }
    prevSoundEnabledRef.current = soundEnabled

    // Clear everything if page is not backgrounded
    if (document.hasFocus()) {
      setFavicon(null)
      return
    }

    // If new focus and backgrounded
    if (focusedStatementId !== -1 && focusedStatementId !== prevFocusedStatementIdRef.current) {
      // Show a bell on favicon
      setFavicon('🔔')

      // Play a sound
      if (soundEnabled) {
        const confirmed = isStatementConfirmed(comments)
        if (confirmed === null) {
          neutralAudioFile.play()
        } else if (confirmed) {
          confirmAudioFile.play()
        } else {
          refuteAudioFile.play()
        }
      }
    }

    prevFocusedStatementIdRef.current = focusedStatementId
  }, [focusedStatementId, soundEnabled, comments, setFavicon])

  return null
}

export default BackgroundNotifier
