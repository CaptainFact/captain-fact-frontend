import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withNamespaces } from 'react-i18next'
import Select from 'react-select'

import { CaretLeft } from 'styled-icons/fa-solid/CaretLeft'
import { CaretRight } from 'styled-icons/fa-solid/CaretRight'
import { Save } from 'styled-icons/boxicons-regular/Save'
import { Ban } from 'styled-icons/fa-solid/Ban'

import { Formik } from 'formik'
import { Box } from '@rebass/grid'
import { Icon } from '../Utils'
import TimeDisplay from '../Utils/TimeDisplay'
import { validateFieldLength } from '../../lib/form_validators'
import { STATEMENT_LENGTH } from '../../constants'
import { forcePosition } from '../../state/video_debate/video/reducer'
import {
  decrementFormCount,
  incrementFormCount,
  setScrollTo
} from '../../state/video_debate/statements/reducer'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import { cleanStrMultiline } from '../../lib/clean_str'
import Button from '../Utils/Button'
import TextareaAutosize from '../FormUtils/TextareaAutosize'
import TextareaLengthCounter from '../FormUtils/TextareaLengthCounter'
import Container from '../StyledUtils/Container'
import StyledLink from '../StyledUtils/StyledLink'
import { Span } from '../StyledUtils/Text'
import { logError } from '../../logger'

@connect(
  ({ VideoDebate: { video, statements } }) => ({
    position: video.playback.position,
    speakers: video.data.speakers,
    submitting: statements.isSubmitting
  }),
  { forcePosition, setScrollTo, incrementFormCount, decrementFormCount }
)
@withNamespaces('videoDebate')
export class StatementForm extends React.PureComponent {
  constructor(props) {
    super(props)

    this.container = React.createRef()
    this.state = {
      lockedTime:
        props.initialValues.time === undefined
          ? props.position
          : props.initialValues.time + props.offset
    }
  }

  componentDidMount() {
    this.props.incrementFormCount()
    this.container.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  componentWillUnmount() {
    this.props.decrementFormCount()
  }

  toggleLock = () => {
    if (this.state.lockedTime === false) {
      this.setState({ lockedTime: this.props.position || 0 })
    } else {
      this.setState({ lockedTime: false })
    }
  }

  moveTimeMarker(position) {
    this.props.forcePosition(position)
    if (this.state.lockedTime !== false) this.setState({ lockedTime: position })
  }

  onSubmit = (values, actions) => {
    const { position, offset } = this.props
    const { lockedTime } = this.state
    const statement = values

    // Get the best value for statement time and apply the reverse offset
    // to use absolute timecode.
    if (lockedTime !== false) {
      statement.time = lockedTime > offset ? lockedTime - offset : 0
    } else if (position && position > offset) {
      statement.time = position - offset
    } else {
      statement.time = 0
    }

    return this.props
      .handleConfirm(statement)
      .then(a => {
        if (a.error) {
          actions.setErrors(a.payload)
        } else {
          this.props.setScrollTo({ id: a.id, __forceAutoScroll: true })
        }
      })
      .catch(e => {
        logError(e)
        this.props.errorToFlash(e)
      })
  }

  handleSubmit(statement) {
    const { position, offset } = this.props
    const { lockedTime } = this.state

    // Get the best value for statement time and apply the reverse offset
    // to use absolute timecode.
    if (lockedTime !== false) {
      statement.time = lockedTime > offset ? lockedTime - offset : 0
    } else if (position && position > offset) {
      statement.time = position - offset
    } else {
      statement.time = 0
    }

    if (!statement.speaker_id) {
      statement.speaker_id = null
    }

    this.props.handleConfirm(statement).then(
      handleFormEffectResponse({
        onSuccess: ({ id }) => this.props.setScrollTo({ id, __forceAutoScroll: true })
      })
    )
  }

  renderForm = ({
    handleSubmit,
    values,
    setFieldValue,
    isValid,
    submitForm,
    isSubmitting
  }) => {
    const { t } = this.props
    const { lockedTime } = this.state
    const currentTime = lockedTime === false ? values.position : lockedTime
    const toggleTimeLockAction = lockedTime === false ? 'unlock' : 'lock'

    return (
      <Box
        ref={this.container}
        as="form"
        onSubmit={handleSubmit}
        className={classNames('statement-form', {
          'card statement': !this.props.isBundled
        })}
      >
        <header className="card-header">
          <div className="card-header-title">
            <Button onClick={() => this.moveTimeMarker(currentTime - 1)}>
              <CaretLeft size="1.25em" />
            </Button>
            <TimeDisplay
              time={currentTime}
              handleClick={() => this.props.forcePosition(currentTime)}
            />
            <Button onClick={() => this.moveTimeMarker(currentTime + 1)}>
              <CaretRight size="1.25em" />
            </Button>
            <Button
              title={t('statement.reverseTimeLock', {
                context: toggleTimeLockAction
              })}
              onClick={this.toggleLock}
            >
              <Icon size="small" name={toggleTimeLockAction} />
            </Button>
            {values.speaker && values.speaker.picture && (
              <img className="speaker-mini" src={values.speaker.picture} alt="" />
            )}

            <Select
              name="speaker"
              className="speaker-select"
              onChange={null}
              onBlur={null}
              value={values.speaker}
              placeholder={t('speaker.add')}
              labelKey="full_name"
              valueKey="id"
              ignoreAccents
              options={this.props.speakers.toJS()}
            />
          </div>
        </header>
        <div className="card-content">
          <Container className="statement-text" position="relative">
            <TextareaAutosize
              name="text"
              value={values.text}
              onChange={e => setFieldValue('text', cleanStrMultiline(e.target.value))}
              maxLength={STATEMENT_LENGTH[1]}
              autoFocus
            />
            <Box mt={3}>
              <TextareaLengthCounter
                length={values.text.length}
                maxLength={STATEMENT_LENGTH[1]}
              />
            </Box>
          </Container>
        </div>
        <footer className="card-footer">
          <StyledLink
            color="black.400"
            className={classNames('card-footer-item', { 'is-loading': isSubmitting })}
            disabled={!isValid || isSubmitting}
            onClick={submitForm}
          >
            <Save size="1.25em" />
            <Span ml={1}>{t('main:actions.save')}</Span>
          </StyledLink>
          <StyledLink
            color="black.400"
            className="card-footer-item"
            disabled={isSubmitting}
            onClick={this.props.handleAbort}
          >
            <Ban size="1em" />
            <Span ml={1}>{t('main:actions.cancel')}</Span>
          </StyledLink>
        </footer>
      </Box>
    )
  }

  render() {
    const { speakers, position } = this.props
    const speaker = speakers.size === 1 ? speakers.get(0) : null

    return (
      <Formik initialValues={{ position, speaker, text: '' }} onSubmit={this.onSubmit}>
        {this.renderForm}
      </Formik>
    )
  }
}
