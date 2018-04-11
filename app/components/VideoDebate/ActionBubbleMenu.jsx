import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'react-i18next'
import { MIN_REPUTATION_UPDATE_VIDEO, ONBOARDING_PLUS_BUTTON } from '../../constants'

import { changeStatementFormSpeaker } from '../../state/video_debate/statements/reducer'
import { toggleAutoscroll } from '../../state/user_preferences/reducer'
import { addModal } from '../../state/modals/reducer'
import {isAuthenticated} from '../../state/users/current_user/selectors'
import { Icon } from '../Utils/Icon'
import ReputationGuard from '../Utils/ReputationGuard'
import ShareModal from '../Utils/ShareModal'
import EditVideoModal from '../Videos/EditVideoModal'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { destroyStatementForm } from '../../state/video_debate/statements/effects'
import store from '../../state/index'
import { addStep } from '../../state/onboarding_steps/reducer'

@connect(
  state => ({
    hasAutoscroll: state.UserPreferences.enableAutoscroll,
    isAuthenticated: isAuthenticated(state),
    hasStatementForm: hasStatementForm(state)
  }),
  {changeStatementFormSpeaker, toggleAutoscroll, addModal, destroyStatementForm, addStep}
)
@translate('videoDebate')
@withRouter
export default class ActionBubbleMenu extends React.PureComponent {
  componentDidMount() {
    const { t, addStep } = this.props

    addStep({
      uniqueId: ONBOARDING_PLUS_BUTTON,
      title: t("onboarding:plus_button.title"),
      text: t("onboarding:plus_button.text"),
      selector: ".action-bubble-container"
    })
  }

  render() {
    return (
      <div className={classNames("action-bubble-container", {hasForm: this.props.hasStatementForm})}>
        {!this.props.isAuthenticated &&
          <ActionBubble iconName="sign-in" label={this.props.t('main:menu.loginSignup')}
                        onClick={() => this.props.router.push('/login')}
          />
        }
        {this.props.isAuthenticated &&
          <ActionBubble iconName={this.props.hasStatementForm ? 'times' : "commenting-o"}
                        label={this.props.t(this.props.hasStatementForm ? 'statement.abortAdd' : 'statement.add')}
                        activated={!this.props.hasStatementForm}
                        onClick={() => this.onStatementBubbleClick()}
          />
        }
        <ActionBubble iconName="arrows-v"
                      label={this.props.t('statement.autoscroll', {
                        context: this.props.hasAutoscroll ? 'disable' : 'enable'
                      })}
                      activated={this.props.hasAutoscroll}
                      onClick={() => this.props.toggleAutoscroll()}
        />
        <ActionBubble iconName="share-alt"
                      label={this.props.t('main:actions.share')}
                      onClick={() => this.props.addModal({
                        Modal: ShareModal,
                        props: {path: location.pathname}
                      })}
        />
        <ReputationGuard requiredRep={MIN_REPUTATION_UPDATE_VIDEO}>
          <ActionBubble iconName="pencil"
                        label={this.props.t('video.edit')}
                        onClick={() => this.props.addModal({Modal: EditVideoModal})}
          />
        </ReputationGuard>
        <ActionBubble iconName="question"
                      label={this.props.t('main:menu.help')}
                      onClick={() => this.props.router.push('/help')}
        />
      </div>
    )
  }

  onStatementBubbleClick() {
    if (this.props.hasStatementForm)
      this.props.destroyStatementForm()
    else
      this.props.changeStatementFormSpeaker({id: 0})
  }
}

const ActionBubble = ({iconName, label, activated=true, ...props}) => (
  <div className={classNames('action-bubble', {activated})} {...props}>
    <div className="label">{label}</div>
    <Icon name={iconName}/>
  </div>
)