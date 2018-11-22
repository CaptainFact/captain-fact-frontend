import React from "react"
import { connect } from "react-redux"
import Tinycon from "tinycon"

import notificationSoundFileURL from "../../assets/sounds/background_statement_focus.mp3"
import { getFocusedStatementId } from "../../state/video_debate/statements/selectors"

const notificationAudioFile = new Audio(notificationSoundFileURL)

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
      background: "transparent",
      fallback: false,
    })
  }

  onFocus() {
    this.setFavicon(null)
  }

  hasNewStatementFocus(prevProps) {
    const { focusedStatementId } = this.props
    return focusedStatementId !== -1 && focusedStatementId !== prevProps.focusedStatementId
  }

  setFavicon(value) {
    // Reset favicon URL each time we interact with it to fix ugly background
    // See https://github.com/tommoor/tinycon/issues/85#issuecomment-244999536
    Tinycon.setImage("/favicons/favicon-32x32.png")
    Tinycon.setBubble(value)
  }

  componentDidMount() {
    this.focusEventListener = window.addEventListener("focus", this.onFocus)
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
      notificationAudioFile.play()
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
      Tinycon.setImage("/favicons/favicon-32x32.png")
      this.setFavicon("🔔")

      // Play a sound
      if (this.props.soundEnabled) {
        notificationAudioFile.play()
      }
    }
  }

  render() {
    return null
  }
}

export default connect((state) => ({
  soundEnabled: state.UserPreferences.enableSoundOnBackgroundFocus,
  focusedStatementId: getFocusedStatementId(state),
}))(BackgroundNotifier)
