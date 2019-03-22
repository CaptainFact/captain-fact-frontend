import React from 'react'
import { connect } from 'react-redux'
import Tinycon from 'tinycon'

import confirmSoundFileURL from '../../assets/sounds/background_statement_confirm.mp3'
import refuteSoundFileURL from '../../assets/sounds/background_statement_refute.mp3'
import neutralSoundFileURL from '../../assets/sounds/background_statement_neutral.mp3'
import { getFocusedStatementId } from '../../state/video_debate/statements/selectors'
import { getAllComments } from '../../state/video_debate/comments/selectors'
import { CONFIRMED_STATEMENT_MIN_VOTES } from '../../constants'

const confirmAudioFile = new Audio(confirmSoundFileURL)
const refuteAudioFile = new Audio(refuteSoundFileURL)
const neutralAudioFile = new Audio(neutralSoundFileURL)

const isStatementConfirmed = comments => {
  const globalStatementScore = comments.reduce((score, comment) => {
    if (comment.approve === true) {
      // Comments with negative score are ignored to avoid trolls
      return score + Math.max(comment.score, 0)
    }
    if (comment.approve === false) {
      return score - Math.max(comment.score, 0)
    }

    // `comment.approve` is null if comment is not confirming/refuting
    return score
  }, 0)

  if (!globalStatementScore) return null
  else if (globalStatementScore >= CONFIRMED_STATEMENT_MIN_VOTES) return true
  else if (globalStatementScore <= -CONFIRMED_STATEMENT_MIN_VOTES) return false
  return null
}

/**
 * This component watches for various events then triggers sounds or change
 * favicon to notify the user that there's something to look at **only**
 * when the current window doesn't have the focus.
 */
class BackgroundNotifier extends React.PureComponent {
  constructor(props) {
    super(props)
    this.focusEventListener = null
    this.onFocus = this.onFocus.bind(this)

    Tinycon.setOptions({
      background: 'transparent',
      fallback: false
    })
  }

  onFocus() {
    this.setFavicon(null)
  }

  hasNewStatementFocus(prevProps) {
    const { focusedStatementId } = this.props
    return (
      focusedStatementId !== -1 && focusedStatementId !== prevProps.focusedStatementId
    )
  }

  setFavicon(value) {
    // Reset favicon URL each time we interact with it to fix ugly background
    // See https://github.com/tommoor/tinycon/issues/85#issuecomment-244999536
    Tinycon.setImage('/favicons/favicon-32x32.png')
    Tinycon.setBubble(value)
  }

  componentDidMount() {
    this.focusEventListener = window.addEventListener('focus', this.onFocus)
  }

  componentWillUnmount() {
    if (this.focusEventListener) {
      window.removeEventListener(this.focusEventListener)
      this.focusEventListener = null
    }
  }

  componentDidUpdate(prevProps) {
    // Play a sound when enabling setting
    if (!prevProps.soundEnabled && this.props.soundEnabled) {
      neutralAudioFile.play()
      return
    }

    // Clear everything if page is not backgrounded
    if (document.hasFocus()) {
      this.setFavicon(null)
      return
    }

    // If new focus and backgrounded
    if (this.hasNewStatementFocus(prevProps)) {
      // Show a bell on favicon
      Tinycon.setImage('/favicons/favicon-32x32.png')
      this.setFavicon('🔔')

      // Play a sound
      if (this.props.soundEnabled) {
        const confirmed = isStatementConfirmed(this.props.comments)
        if (confirmed === null) neutralAudioFile.play()
        else if (confirmed) confirmAudioFile.play()
        else refuteAudioFile.play()
      }
    }
  }

  render() {
    return null
  }
}

export default connect(state => {
  const focusedStatementId = getFocusedStatementId(state)
  const comments = getAllComments(state).get(focusedStatementId, [])
  return {
    soundEnabled: state.UserPreferences.enableSoundOnBackgroundFocus,
    focusedStatementId,
    comments
  }
})(BackgroundNotifier)
