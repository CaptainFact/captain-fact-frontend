import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withNamespaces } from 'react-i18next'

import SpeakersSelect from '../Speakers/SpeakersSelect'
import { ReactSelectWarningStyles } from '../../lib/react_select_theme'
import { Icon, LinkWithIcon } from '../Utils'
import TimeEdit from '../Utils/TimeEdit'
import { validateFieldLength } from '../../lib/form_validators'
import { STATEMENT_LENGTH } from '../../constants'
import { forcePosition } from '../../state/video_debate/video/reducer'
import {
  decrementFormCount,
  incrementFormCount,
  setScrollTo,
  STATEMENT_FORM_NAME,
} from '../../state/video_debate/statements/reducer'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import ControlTextarea from '../FormUtils/ControlTextarea'
import { cleanStrMultiline } from '../../lib/clean_str'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

@connect(
  ({ VideoDebate: { video, statements } }) => ({
    position: video.playback.position,
    speakers: video.data.speakers,
    submitting: statements.isSubmitting,
  }),
  { forcePosition, setScrollTo, incrementFormCount, decrementFormCount }
)
@reduxForm({ form: STATEMENT_FORM_NAME })
@withNamespaces('videoDebate')
export class StatementForm extends React.PureComponent {
  constructor(props) {
    super(props)
    const lockedTime =
      props.initialValues.time === undefined
        ? props.position
        : props.initialValues.time + props.offset

    this.state = { lockedTime, emptySpeakerWarningHadBeenShown: false }
  }

  componentDidMount() {
    this.props.incrementFormCount()
    this.refs.container.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  componentWillUnmount() {
    this.props.decrementFormCount()
  }

  toggleLock() {
    if (this.state.lockedTime === false) {
      this.setState({ lockedTime: this.props.position || 0 })
    } else {
      this.setState({ lockedTime: false })
    }
  }

  moveTimeMarker = (position) => {
    this.props.forcePosition(position)
    if (this.state.lockedTime !== false) {
      this.setState({ lockedTime: position })
    }
  }

  handleSubmit(statement) {
    const { position, offset } = this.props
    const { lockedTime, emptySpeakerWarningHadBeenShown } = this.state

    // Get the best value for statement time and apply the reverse offset
    // to use absolute timecode.
    if (lockedTime !== false) {
      statement.time = lockedTime > offset ? lockedTime - offset : 0
    } else if (position && position > offset) {
      statement.time = position - offset
    } else {
      statement.time = 0
    }

    // When a speaker is not given on the first submission,
    // a warning message pops up once before submit.
    if (!statement.speaker_id && !emptySpeakerWarningHadBeenShown) {
      this.setState({ emptySpeakerWarningHadBeenShown: true })
      return
    } else if (!statement.speaker_id) {
      statement.speaker_id = null
    }

    this.props.handleConfirm(statement).then(
      handleFormEffectResponse({
        onSuccess: ({ id }) => this.props.setScrollTo({ id, __forceAutoScroll: true }),
      })
    )
  }

  render() {
    const { position, handleSubmit, valid, speakers, initialValues, handleAbort, t } = this.props
    const currentTime = this.state.lockedTime === false ? position : this.state.lockedTime
    const speaker = initialValues.speaker_id
      ? speakers.find((s) => s.id === initialValues.speaker_id)
      : null
    const toggleTimeLockAction = this.state.lockedTime === false ? 'unlock' : 'lock'

    return (
      <form
        className={classNames('statement-form', {
          'card statement': !this.props.isBundled,
        })}
        ref="container"
      >
        <header className="card-header">
          <div className="card-header-title">
            <a className="button" onClick={() => this.moveTimeMarker(currentTime - 1)}>
              <Icon name="caret-left" />
            </a>
            <TimeEdit
              time={currentTime}
              handleChange={this.moveTimeMarker}
              onTimeIconClick={() => this.moveTimeMarker(currentTime)}
            />
            <a className="button" onClick={() => this.moveTimeMarker(currentTime + 1)}>
              <Icon name="caret-right" />
            </a>
            <a
              className="button"
              title={t('statement.reverseTimeLock', {
                context: toggleTimeLockAction,
              })}
              onClick={this.toggleLock.bind(this)}
            >
              <Icon size="small" name={toggleTimeLockAction} />
            </a>
            {speaker && speaker.picture && <img className="speaker-mini" src={speaker.picture} />}
            <Field
              name="speaker_id"
              component={SpeakersSelect}
              speakers={speakers}
              placeholder={t('speaker.add')}
              styles={this.state.emptySpeakerWarningHadBeenShown ? ReactSelectWarningStyles : null}
              onChange={() => this.setState({ emptySpeakerWarningHadBeenShown: false })}
            />
          </div>
        </header>
        <div className="card-content">
          <div className="statement-text">
            <Field
              name="text"
              component={ControlTextarea}
              normalize={cleanStrMultiline}
              maxLength={STATEMENT_LENGTH[1]}
              validate={(value) => validateFieldLength(t, value, STATEMENT_LENGTH)}
              placeholder={
                speaker ? t('statement.textPlaceholder') : t('statement.noSpeakerTextPlaceholder')
              }
              hideErrorIfEmpty
              autoFocus
              autosize
              warningMessage={
                this.state.emptySpeakerWarningHadBeenShown ? t('statement.noSpeakerWarning') : null
              }
            />
          </div>
        </div>
        <footer className="card-footer">
          <LinkWithIcon
            iconName="floppy-o"
            className={classNames('card-footer-item', 'submit-button', {
              'is-loading': this.props.submitting,
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
        <div className="helpStatement">
          <p>
            <strong>{t('statement.help1')}</strong>
          </p>
          <p>{t('statement.help2')}</p>
          <p>{t('statement.help3')}</p>
          <p>{t('statement.help4')}</p>
          <p>{t('statement.help5')}</p>
          <p>
            <i>{t('statement.help11')}</i>
          </p>
          <p>
            <br />
            <strong>{t('statement.help6')}</strong>
          </p>
          <p>{t('statement.help7')}</p>
          <p>{t('statement.help8')}</p>
          <p>{t('statement.help9')}</p>
          <p>{t('statement.help10')}</p>
          <p>
            <br />
            <ExternalLinkNewTab href="/help/contributionGuidelines">
              {t('statement.helpLink')}
            </ExternalLinkNewTab>
          </p>
        </div>
      </form>
    )
  }
}
