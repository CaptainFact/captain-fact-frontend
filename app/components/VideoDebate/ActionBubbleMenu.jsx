import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { MIN_REPUTATION_UPDATE_VIDEO } from '../../constants'

import { changeStatementFormSpeaker } from '../../state/video_debate/statements/reducer'
import { addModal } from '../../state/modals/reducer'
import { Icon } from '../Utils/Icon'
import ReputationGuard from '../Utils/ReputationGuard'
import ShareModal from '../Utils/ShareModal'
import EditVideoModal from '../Videos/EditVideoModal'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { destroyStatementForm } from '../../state/video_debate/statements/effects'
import {
  toggleAutoscroll,
  toggleBackgroundSound
} from '../../state/user_preferences/reducer'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

@connect(
  state => ({
    hasAutoscroll: state.UserPreferences.enableAutoscroll,
    soundOnBackgroundFocus: state.UserPreferences.enableSoundOnBackgroundFocus,
    hasStatementForm: hasStatementForm(state)
  }),
  {
    changeStatementFormSpeaker,
    toggleAutoscroll,
    toggleBackgroundSound,
    addModal,
    destroyStatementForm
  }
)
@withNamespaces('videoDebate')
@withRouter
@withLoggedInUser
export default class ActionBubbleMenu extends React.PureComponent {
  render() {
    const { t, hasStatementForm, soundOnBackgroundFocus } = this.props

    return (
      <div
        className={classNames('action-bubble-container', {
          hasForm: hasStatementForm
        })}
      >
        {!this.props.isAuthenticated && (
          <ActionBubble
            iconName="sign-in"
            label={t('main:menu.signup')}
            onClick={() => this.props.router.push('/signup')}
          />
        )}
        {this.props.isAuthenticated && (
          <ActionBubble
            iconName={hasStatementForm ? 'times' : 'commenting-o'}
            label={t(hasStatementForm ? 'statement.abortAdd' : 'statement.add')}
            activated={!hasStatementForm}
            onClick={() => this.onStatementBubbleClick()}
          />
        )}
        <ActionBubble
          iconName="arrows-v"
          label={t('statement.autoscroll', {
            context: this.props.hasAutoscroll ? 'disable' : 'enable'
          })}
          activated={this.props.hasAutoscroll}
          onClick={() => this.props.toggleAutoscroll()}
        />
        <ActionBubble
          iconName={soundOnBackgroundFocus ? 'sound' : 'sound-mute'}
          label={t('statement.soundOnBackgroundFocus', {
            context: soundOnBackgroundFocus ? 'disable' : 'enable'
          })}
          activated={soundOnBackgroundFocus}
          onClick={() => this.props.toggleBackgroundSound()}
        />
        <ActionBubble
          iconName="share-alt"
          label={t('main:actions.share')}
          onClick={() => this.props.addModal({
            Modal: ShareModal,
            props: { path: location.pathname }
          })
          }
        />
        <ReputationGuard requiredRep={MIN_REPUTATION_UPDATE_VIDEO}>
          <ActionBubble
            iconName="pencil"
            label={t('video.edit')}
            onClick={() => this.props.addModal({ Modal: EditVideoModal })}
          />
        </ReputationGuard>
        <ActionBubble
          iconName="question"
          label={t('main:menu.help')}
          onClick={() => this.props.router.push('/help')}
        />
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
