import React from "react"
import { connect } from "react-redux"
import { Link, withRouter } from 'react-router'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { isAuthenticated } from "../../state/users/current_user/selectors"
import { staticResource } from "../../API"
import { ModalFormContainer } from "../Modal"
import { Icon, LinkWithIcon } from "../Utils"
import { EditSpeakerForm } from "./SpeakerForm"
import ModalRemoveSpeaker from './ModalRemoveSpeaker'
import { addModal } from '../../state/modals/reducer'
import { removeSpeaker, updateSpeaker } from '../../state/video_debate/effects'
import { changeStatementFormSpeaker } from '../../state/video_debate/statements/reducer'
import MediaLayout from '../Utils/MediaLayout'
import {getFocusedStatementSpeakerId} from '../../state/video_debate/statements/selectors'


@withRouter
@translate(['videoDebate', 'main'])
@connect((state, props) => (
  {isAuthenticated: isAuthenticated(state), isFocused: getFocusedStatementSpeakerId(state) === props.speaker.id}),
  {addModal, changeStatementFormSpeaker, removeSpeaker, updateSpeaker}
)
export class SpeakerPreview extends React.PureComponent {
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
    this.props.addModal({
      Modal: ModalFormContainer,
      props: {
        title: `Edit ${this.props.speaker.full_name} information`,
        FormComponent: EditSpeakerForm,
        handleConfirm: (s) => this.props.updateSpeaker(s),
        formProps: {initialValues: this.props.speaker.toJS()}
      }
    })
  }

  handleAddStatement() {
    const historyRegex = new RegExp("/history/?$")
    const currentPath = this.props.location.pathname
    if (currentPath.match(historyRegex))
      this.props.router.push(currentPath.replace(historyRegex, ""))
    this.props.changeStatementFormSpeaker({id: this.props.speaker.id})
  }

  renderSpeakerThumb(speaker) {
    if (speaker.picture)
      return (<img className="speaker-picture" src={staticResource(speaker.picture)}/>)
    return (<Icon className="speaker-picture" name="user" size="large" style={{color: "grey"}}/>)
  }

  getTitle() {
    const { title, is_user_defined, country } = this.props.speaker
    // Only translate if title exists and is not user defined
    if (!title)
      return '...'
    else if (is_user_defined)
      return title

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

  render() {
    const { speaker, isAuthenticated, withoutActions, t , className} = this.props

    return (
      <MediaLayout
        className={classNames("speaker-preview", className, {isActive: this.props.isFocused})}
        left={this.renderSpeakerThumb(speaker)}
        content={
          <div>
            {this.renderName(speaker)}
            <p className="subtitle is-6">{this.getTitle()}</p>
          </div>
        }
        right={!isAuthenticated || withoutActions ? null :
          <div className="quick-actions">
            {this.props.speaker.is_user_defined &&
            <LinkWithIcon iconName="pencil"
                          title={t('main:actions.edit')}
                          onClick={() => this.handleEdit()}/>
            }
            <LinkWithIcon iconName="times"
                          title={t('main:actions.remove')}
                          onClick={() => this.handleRemove()}/>
            <LinkWithIcon iconName="commenting-o"
                          title={t('statement.add')}
                          onClick={() => this.handleAddStatement()}/>
          </div>
        }
      />
    )
  }

  renderName(speaker) {
    if (speaker.is_user_defined)
      return <div className="title is-4 speaker-name">{speaker.full_name}</div>
    return (
      <Link to={`/s/${speaker.slug || speaker.id}`} className="title is-4 speaker-name">
        {speaker.full_name}
      </Link>
    )
  }
}
