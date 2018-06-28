import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import classNames from 'classnames'
import SpeakersSelect from '../Speakers/SpeakersSelect'

import { Icon, LinkWithIcon } from '../Utils'
import TimeDisplay from '../Utils/TimeDisplay'
import { renderTextareaField, validateFieldLength, cleanStrMultiline } from '../FormUtils'
import { STATEMENT_LENGTH } from '../../constants'
import { translate } from 'react-i18next'
import { forcePosition } from '../../state/video_debate/video/reducer'
import { decrementFormCount, incrementFormCount, setScrollTo, STATEMENT_FORM_NAME } from '../../state/video_debate/statements/reducer'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'


@connect(({VideoDebate: {video, statements}}) => ({
  position: video.playback.position,
  speakers: video.data.speakers,
  submitting: statements.isSubmitting
}), {forcePosition, setScrollTo, incrementFormCount, decrementFormCount})
@reduxForm({form: STATEMENT_FORM_NAME})
@translate('videoDebate')
export class StatementForm extends React.PureComponent {
  constructor(props) {
    super(props)
    const lockedTime = props.initialValues.time === undefined ? props.position : props.initialValues.time
    this.state = {lockedTime}
  }

  componentDidMount() {
    this.props.incrementFormCount()
    this.refs.container.scrollIntoView({behavior: 'smooth'})
  }

  componentWillUnmount() {
    this.props.decrementFormCount()
  }

  toggleLock() {
    if (this.state.lockedTime === false)
      this.setState({lockedTime: this.props.position || 0})
    else
      this.setState({lockedTime: false})
  }

  moveTimeMarker(position) {
    this.props.forcePosition(position)
    if (this.state.lockedTime !== false)
      this.setState({lockedTime: position})
  }

  handleSubmit(statement) {
    const currentTime = this.state.lockedTime === false ? this.props.position : this.state.lockedTime
    if (currentTime !== 0 && !currentTime)
      statement.time = this.props.initialValues.time || 0
    else
      statement.time = currentTime || 0
    if (!statement.speaker_id)
      statement.speaker_id = null
    this.props.handleConfirm(statement).then(handleFormEffectResponse({
      onSuccess: ({id}) => this.props.setScrollTo({id, __forceAutoScroll: true})
    }))
  }

  render() {
    const { position, handleSubmit, valid, speakers, initialValues, handleAbort, t } = this.props
    const currentTime = this.state.lockedTime === false ? position : this.state.lockedTime
    const speaker = initialValues.speaker_id ? speakers.find(s => s.id === initialValues.speaker_id) : null
    const toggleTimeLockAction = this.state.lockedTime === false ? 'unlock' : 'lock'

    return (
      <form className={classNames('statement-form', {'card statement': !this.props.isBundled})} ref="container">
        <header className="card-header">
          <div className="card-header-title">
            <a className="button" onClick={() => this.moveTimeMarker(currentTime - 1)}>
              <Icon name="caret-left"/>
            </a>
            <TimeDisplay time={currentTime} handleClick={() => this.props.forcePosition(currentTime)}/>
            <a className="button" onClick={() => this.moveTimeMarker(currentTime + 1)}>
              <Icon name="caret-right"/>
            </a>
            <a
              className="button"
              title={t('statement.reverseTimeLock', {context: toggleTimeLockAction})}
              onClick={this.toggleLock.bind(this)}
            >
              <Icon size="small" name={toggleTimeLockAction}/>
            </a>
            {speaker && speaker.picture && <img alt="StatementForm.jsx" className="speaker-mini" src={speaker.picture}/>}
            <Field name="speaker_id" component={SpeakersSelect} speakers={speakers} placeholder={t('speaker.add')}/>
          </div>
        </header>
        <div className="card-content">
          <h3 className="statement-text">
            <Field
              name="text"
              component={renderTextareaField}
              normalize={cleanStrMultiline}
              maxLength={STATEMENT_LENGTH[1]}
              validate={value => validateFieldLength(t, value, STATEMENT_LENGTH)}
              placeholder={speaker ?
                t('statement.textPlaceholder', {speaker}) :
                t('statement.noSpeakerTextPlaceholder')}
              hideErrorIfEmpty
              autoFocus
              autosize
              style={{minHeight: '100px'}}
            />
          </h3>
        </div>
        <footer className="card-footer">
          <LinkWithIcon
            iconName="floppy-o"
            className={classNames('card-footer-item', 'submit-button', {
              'is-loading': this.props.submitting
            })}
            disabled={!valid || this.props.submitting}
            onClick={handleSubmit(this.handleSubmit.bind(this))}
          >
            {t('main:actions.save')}
          </LinkWithIcon>
          <LinkWithIcon
            iconName="ban"
            className="card-footer-item"
            disabled={this.props.submitting}
            onClick={handleAbort}
          >
            {t('main:actions.cancel')}
          </LinkWithIcon>
        </footer>
      </form>
    )
  }
}
