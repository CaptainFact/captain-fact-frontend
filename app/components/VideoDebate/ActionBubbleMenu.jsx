import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'react-i18next'

import { changeStatementFormSpeaker } from '../../state/video_debate/statements/reducer'
import { toggleAutoscroll } from '../../state/user_preferences/reducer'
import { addModal } from '../../state/modals/reducer'
import {isAuthenticated} from '../../state/users/current_user/selectors'
import { Icon } from '../Utils/Icon'
import ShareModal from '../Utils/ShareModal'


@connect(
  state => ({hasAutoscroll: state.UserPreferences.enableAutoscroll, isAuthenticated: isAuthenticated(state)}),
  {changeStatementFormSpeaker, toggleAutoscroll, addModal}
)
@translate(['videoDebate', 'main'])
@withRouter
export default class ActionBubbleMenu extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {active: false}
    this.activate = this.activate.bind(this)
  }

  addStatement() {
    this.props.changeStatementFormSpeaker({id: 0})
    document.querySelector('.statements-list').scrollIntoView()
  }

  activate() {
    // Delay on mouseEnter is meant to avoid the fact that touch devices trigger mouseEnter then
    // onClick at the same time when touching
    setTimeout(() => this.setState({active: true}), 100)
  }

  render() {
    return (
      <div className={classNames("action-bubble-container", {active: this.state.active})}
           onMouseEnter={this.activate}
           onMouseLeave={() => this.setState({active: false})}
           onTouchStart={this.activate}
      >
        {this.props.isAuthenticated &&
          <ActionBubble iconName="commenting-o"
                        label={this.props.t('statement.add')}
                        onClick={() => this.state.active ? this.addStatement() : null}
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
        <ActionBubble iconName="question"
                      label={this.props.t('main:menu.help')}
                      onClick={() => this.props.router.push('/help')}
        />
      </div>
    )
  }
}

const ActionBubble = ({iconName, label, activated=true, ...props}) => (
  <div className={classNames('action-bubble', {activated})} {...props}>
    <div className="label">{label}</div>
    <Icon name={iconName}/>
  </div>
)