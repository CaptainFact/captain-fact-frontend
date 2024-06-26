import classNames from 'classnames'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { destroyStatementForm } from '../../state/video_debate/statements/effects'
import { changeStatementForm } from '../../state/video_debate/statements/reducer'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Icon } from '../Utils/Icon'

@connect(
  (state) => ({
    hasAutoscroll: state.UserPreferences.enableAutoscroll,
    soundOnBackgroundFocus: state.UserPreferences.enableSoundOnBackgroundFocus,
    hasStatementForm: hasStatementForm(state),
  }),
  {
    changeStatementForm,
    destroyStatementForm,
  },
)
@withNamespaces('videoDebate')
@withRouter
@withLoggedInUser
export default class ActionBubbleMenu extends React.PureComponent {
  render() {
    const { t, hasStatementForm, isAuthenticated, hidden, customActions } = this.props
    return (
      <div
        className={classNames('action-bubble-container', {
          hasForm: hasStatementForm,
          hiddenBelow: hidden,
        })}
      >
        {isAuthenticated ? (
          <React.Fragment>
            <ActionBubble
              iconName={hasStatementForm ? 'times' : 'commenting-o'}
              label={t(hasStatementForm ? 'statement.abortAdd' : 'statement.add')}
              activated={!hasStatementForm}
              onClick={() => !hidden && this.onStatementBubbleClick()}
            />
            {customActions || null}
          </React.Fragment>
        ) : (
          <ActionBubble
            iconName="sign-in"
            label={t('main:menu.signup')}
            onClick={() => this.props.history.push('/signup')}
          />
        )}
      </div>
    )
  }

  onStatementBubbleClick() {
    if (this.props.hasStatementForm) {
      this.props.destroyStatementForm()
    } else {
      const subPathRegex = new RegExp('/videos/(.+)/(captions|transcript)/?')
      const match = subPathRegex.exec(location.pathname)
      if (match) {
        this.props.history.push(`/videos/${match[1]}`)
      }

      const values = this.props.getStatementInitialValues?.() || {}
      this.props.changeStatementForm({ speaker_id: 0, ...values })
    }
  }
}

export const ActionBubble = ({ iconName, label, activated = true, ...props }) => (
  <div className={classNames('action-bubble', { activated })} {...props}>
    <div className="label">{label}</div>
    <Icon name={iconName} />
  </div>
)
