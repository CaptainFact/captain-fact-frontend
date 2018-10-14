import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import {
  MIN_REPUTATION_ADD_STATEMENT,
  MIN_REPUTATION_REMOVE_SPEAKER, MIN_REPUTATION_UPDATE_SPEAKER
} from '../../constants'

import { isAuthenticated } from '../../state/users/current_user/selectors'
import { ModalFormContainer } from '../Modal'
import Icon from '../Utils/Icon'
import ClickableIcon from '../Utils/ClickableIcon'
import ReputationGuard from '../Utils/ReputationGuard'
import EditSpeakerForm from './EditSpeakerForm'
import ModalRemoveSpeaker from './ModalRemoveSpeaker'
import { addModal } from '../../state/modals/reducer'
import { removeSpeaker, updateSpeaker } from '../../state/video_debate/effects'
import { changeStatementFormSpeaker } from '../../state/video_debate/statements/reducer'
import MediaLayout from '../Utils/MediaLayout'
import {getFocusedStatementSpeakerId} from '../../state/video_debate/statements/selectors'


@withRouter
@withNamespaces('videoDebate')
@connect((state, props) => (
  {isAuthenticated: isAuthenticated(state), isFocused: getFocusedStatementSpeakerId(state) === props.speaker.id}),
{addModal, changeStatementFormSpeaker, removeSpeaker, updateSpeaker}
)
export class SpeakerPreview extends React.PureComponent {
  render() {
    const {speaker, isAuthenticated, withoutActions, className} = this.props

    return (
      <MediaLayout
        className={classNames('speaker-preview', className, {isActive: this.props.isFocused})}
        left={this.renderSpeakerThumb(speaker)}
        content={(
          <React.Fragment>
            {this.renderName(speaker)}
            <p className="subtitle">{this.getTitle()}</p>
          </React.Fragment>
        )}
        right={isAuthenticated && !withoutActions && this.renderActions()}
      />
    )
  }

  renderSpeakerThumb(speaker) {
    if (speaker.picture)
      return <img className="speaker-picture" src={speaker.picture}/>
    return <Icon className="speaker-picture" name="user" size="large" style={{color: 'grey'}}/>
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

  getTitle() {
    const { title, country } = this.props.speaker
    // Only translate if title exists and is not user defined
    if (!title)
      return '...'

    let i18nTitle = ''
    if (this.props.i18n.language === 'en') // No need to translate title for english
      i18nTitle = title
    else {
      // If unknown title, return raw title
      const i18nTitleKey = `speaker.titles.${title}`
      i18nTitle = this.props.t(i18nTitleKey)
      if (i18nTitle === i18nTitleKey)
        return title
    }
    // Try to return title + nationality, otherwise fallback on translated title
    return this.props.t('speaker.titleFormat', {
      title: i18nTitle,
      context: country
    })
  }

  handleRemove() {
    this.props.addModal({
      Modal: ModalRemoveSpeaker,
      props: {
        speaker: this.props.speaker,
        handleConfirm: () => this.props.removeSpeaker(this.props.speaker)
      }
    })
  }

  handleEdit() {
    const titleModal = this.props.t('speaker.edit', {
      name: this.props.speaker.full_name
    })

    this.props.addModal({
      Modal: ModalFormContainer,
      props: {
        title: titleModal,
        FormComponent: EditSpeakerForm,
        handleConfirm: (s) => this.props.updateSpeaker(s),
        formProps: {initialValues: this.props.speaker.toJS()}
      }
    })
  }

  handleAddStatement() {
    const historyRegex = new RegExp('/history/?$')
    const currentPath = this.props.location.pathname
    if (currentPath.match(historyRegex))
      this.props.router.push(currentPath.replace(historyRegex, ''))
    this.props.changeStatementFormSpeaker({id: this.props.speaker.id})
  }
}
