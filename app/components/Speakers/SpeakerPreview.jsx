import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import { Flex } from '@rebass/grid'

import { MicrophoneAlt } from 'styled-icons/boxicons-solid'

import {
  MIN_REPUTATION_ADD_STATEMENT,
  MIN_REPUTATION_REMOVE_SPEAKER,
  MIN_REPUTATION_UPDATE_SPEAKER,
} from '../../constants'
import ClickableIcon from '../Utils/ClickableIcon'
import ReputationGuard from '../Utils/ReputationGuard'
import EditSpeakerFormModal from './EditSpeakerFormModal'
import ModalRemoveSpeaker from './ModalRemoveSpeaker'
import { addModal } from '../../state/modals/reducer'
import { removeSpeaker } from '../../state/video_debate/effects'
import { changeStatementFormSpeaker } from '../../state/video_debate/statements/reducer'
import { getFocusedStatementSpeakerId } from '../../state/video_debate/statements/selectors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

@withRouter
@withNamespaces('videoDebate')
@connect(
  (state, props) => ({
    isFocused: getFocusedStatementSpeakerId(state) === props.speaker.id,
  }),
  { addModal, changeStatementFormSpeaker, removeSpeaker }
)
@withLoggedInUser
export class SpeakerPreview extends React.PureComponent {
  render() {
    const { speaker, isAuthenticated, withoutActions, className, isFocused } = this.props
    const classes = classNames('speaker-preview', className, { isActive: isFocused })

    return (
      <Flex className={classes} alignItems="center">
        <Flex
          className="speaker-picture"
          flex="0 0 50px"
          justifyContent="center"
          alignItems="center"
          mr="1rem"
        >
          {this.renderSpeakerThumb(speaker)}
        </Flex>
        <Flex flex="1 1 auto" flexDirection="column">
          {this.renderName(speaker)}
          <p className="subtitle">{speaker.title || '...'}</p>
        </Flex>
        <Flex>{isAuthenticated && !withoutActions && this.renderActions()}</Flex>
      </Flex>
    )
  }

  renderSpeakerThumb(speaker) {
    return speaker.picture ? (
      <img alt="" className="speaker-picture" src={speaker.picture} />
    ) : (
      <MicrophoneAlt size="2.75em" />
    )
  }

  renderActions() {
    return (
      <div className="quick-actions">
        <ReputationGuard requiredRep={MIN_REPUTATION_UPDATE_SPEAKER}>
          <ClickableIcon
            name="pencil"
            size="action-size"
            title={this.props.t('main:actions.edit')}
            onClick={() => this.handleEdit()}
          />
        </ReputationGuard>
        <ReputationGuard requiredRep={MIN_REPUTATION_REMOVE_SPEAKER}>
          <ClickableIcon
            name="times"
            size="action-size"
            title={this.props.t('main:actions.remove')}
            onClick={() => this.handleRemove()}
          />
        </ReputationGuard>
        <ReputationGuard requiredRep={MIN_REPUTATION_ADD_STATEMENT}>
          <ClickableIcon
            name="commenting-o"
            size="action-size"
            title={this.props.t('statement.add')}
            onClick={() => this.handleAddStatement()}
          />
        </ReputationGuard>
      </div>
    )
  }

  renderName(speaker) {
    return (
      <Link to={`/s/${speaker.slug || speaker.id}`} className="speaker-name" target="_blank">
        {speaker.full_name}
      </Link>
    )
  }

  handleRemove() {
    this.props.addModal({
      Modal: ModalRemoveSpeaker,
      props: {
        speaker: this.props.speaker,
        handleConfirm: () => this.props.removeSpeaker(this.props.speaker),
      },
    })
  }

  handleEdit() {
    this.props.addModal({
      Modal: EditSpeakerFormModal,
      props: { speaker: this.props.speaker.toJS() },
    })
  }

  handleAddStatement() {
    const historyRegex = new RegExp('/history/?$')
    const currentPath = this.props.location.pathname
    if (currentPath.match(historyRegex)) {
      this.props.router.push(currentPath.replace(historyRegex, ''))
    }
    this.props.changeStatementFormSpeaker({ id: this.props.speaker.id })
  }
}
