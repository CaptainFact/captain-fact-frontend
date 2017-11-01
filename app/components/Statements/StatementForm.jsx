import React from "react"
import { Field, reduxForm } from 'redux-form'
import { connect } from "react-redux"
import Select from 'react-select'
import classNames from 'classnames'

import { Icon, LinkWithIcon } from "../Utils"
import TimeDisplay from '../Utils/TimeDisplay'
import { renderTextareaField, validateLengthI18n, cleanStrMultiline } from "../FormUtils"
import { STATEMENT_LENGTH } from "../../constants"
import { translate } from 'react-i18next'
import { forcePosition } from '../../state/video_debate/video/reducer'
import { decrementFormCount, incrementFormCount, setScrollTo } from '../../state/video_debate/statements/reducer'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import {staticResource} from '../../API/resources'


const validate = ({text, time}, {t}) => {
  const errors = {}

  validateLengthI18n(t, errors, 'text', text, STATEMENT_LENGTH, "videoDebate:statement:text")
  if (time < 0)
    errors.time = "Invalid time"
  return errors
}

const SpeakersSelect = ({input, speakers}) => {
  return (
    <Select className="speaker-select"
            onChange={s => s && s.id ? input.onChange(s.id) : input.onChange(null)}
            onBlur={() => input.onBlur(input.value.id)}
            value={input.value}
            name={input.name}
            placeholder="Select Speaker..."
            labelKey="full_name"
            valueKey="id"
            ignoreAccents={true}
            options={speakers.toJS()}
    />
  )
}

@translate(['videoDebate', 'main'])
@reduxForm({form: 'StatementForm', validate})
@connect(({VideoDebate: {video, statements}}) => ({
  position: video.playback.position,
  speakers: video.data.speakers,
  submitting: statements.isSubmitting
}), {forcePosition, setScrollTo, incrementFormCount, decrementFormCount})
export class StatementForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {lockedTime: props.initialValues.time === undefined ? props.position : props.initialValues.time}
  }

  componentDidMount() {
    this.props.incrementFormCount()
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
      onSuccess: (st) => this.props.setScrollTo(st)
    }))
  }

  render() {
    const { position, handleSubmit, valid, speakers, initialValues, handleAbort, t } = this.props
    const currentTime = this.state.lockedTime === false ? position : this.state.lockedTime
    const speaker = initialValues.speaker_id ? speakers.find(s => s.id === initialValues.speaker_id) : null

    return (
      <form className={`statement-form${this.props.isBundled ? '' : ' card statement'}`}>
        <header className="card-header">
          <div className="card-header-title">
            <a className="button"
              onClick={() => this.moveTimeMarker(currentTime - 1)}>
              <Icon name="caret-left"/>
            </a>
            <TimeDisplay time={currentTime}
                         handleClick={() => this.props.forcePosition(currentTime)}/>
            <a className="button"
               onClick={() => this.moveTimeMarker(currentTime + 1)}>
              <Icon name="caret-right"/>
            </a>
            <a className="button" title="Lock time marker" onClick={this.toggleLock.bind(this)}>
              <Icon size="small" name={this.state.lockedTime === false ? 'unlock' : 'lock'}/>
            </a>
              {speaker && speaker.picture &&
                <img className="speaker-mini" src={staticResource(speaker.picture)}/>
              }
              <Field name="speaker_id" component={SpeakersSelect} speakers={speakers}/>
          </div>
        </header>
        <div className="card-content">
          <div className="statement-text">
            <Field autoFocus component={renderTextareaField} name="text" autosize={true}
              normalize={cleanStrMultiline}
              placeholder={speaker ? t('statement.textPlaceholder') : t('statement.noSpeakerTextPlaceholder')}/>
          </div>
        </div>
        <footer className="card-footer">
          <LinkWithIcon iconName="floppy-o"
                        className={classNames('card-footer-item', 'submit-button', {
                          'is-disabled': !valid || this.props.submitting,
                          'is-loading': this.props.submitting
                        })}
            onClick={handleSubmit(this.handleSubmit.bind(this))}>
            {t('main:actions.save')}
          </LinkWithIcon>
          <LinkWithIcon iconName="ban" className={classNames('card-footer-item', {
                          'is-disabled': this.props.submitting
                        })}
                        onClick={handleAbort}>
            {t('main:actions.cancel')}
          </LinkWithIcon>
        </footer>
      </form>
    )
  }
}
