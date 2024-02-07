import classNames from 'classnames'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { destroyStatementForm } from '../../state/video_debate/statements/effects'
import { changeStatementFormSpeaker } from '../../state/video_debate/statements/reducer'
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
    changeStatementFormSpeaker,
    destroyStatementForm,
  },
)
@withNamespaces('videoDebate')
@withRouter
@withLoggedInUser
export default class ActionBubbleMenu extends React.PureComponent {
  render() {
    const { t, hasStatementForm, isAuthenticated } = this.props

    return (
      <div
        className={classNames('action-bubble-container', {
          hasForm: hasStatementForm,
        })}
      >
        {isAuthenticated ? (
          <ActionBubble
            iconName={hasStatementForm ? 'times' : 'commenting-o'}
            label={t(hasStatementForm ? 'statement.abortAdd' : 'statement.add')}
            activated={!hasStatementForm}
            onClick={() => this.onStatementBubbleClick()}
          />
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
      this.props.changeStatementFormSpeaker({ id: 0 })
    }
  }
}

const ActionBubble = ({ iconName, label, activated = true, ...props }) => (
  <div className={classNames('action-bubble', { activated })} {...props}>
    <div className="label">{label}</div>
    <Icon name={iconName} />
  </div>
)
