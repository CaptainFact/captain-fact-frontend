import { ChevronLeft, ChevronRight, Lock, Mic, Save, Slash, Unlock } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import { cn } from '@/lib/css-utils'
import { Button } from '@/ui/button'

import { STATEMENT_LENGTH } from '../../constants'
import { cleanStrMultiline } from '../../lib/clean_str'
import { validateFieldLength } from '../../lib/form_validators'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import { ReactSelectWarningStyles } from '../../lib/react_select_theme'
import {
  decrementFormCount,
  incrementFormCount,
  setScrollTo,
  STATEMENT_FORM_NAME,
} from '../../state/video_debate/statements/reducer'
import { forcePosition } from '../../state/video_debate/video/reducer'
import ControlTextarea from '../FormUtils/ControlTextarea'
import SpeakersSelect from '../Speakers/SpeakersSelect'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import TimeEdit from '../Utils/TimeEdit'

const validate = (values, props) => {
  return {
    text: validateFieldLength(props.t, values.text, STATEMENT_LENGTH),
  }
}

@connect(
  ({ VideoDebate: { video, statements } }) => ({
    position: video.playback.position,
    speakers: video.data.speakers,
    submitting: statements.isSubmitting,
  }),
  { forcePosition, setScrollTo, incrementFormCount, decrementFormCount },
)
@withTranslation('videoDebate')
@reduxForm({ form: STATEMENT_FORM_NAME, validate })
export class StatementForm extends React.Component {
  constructor(props) {
    super(props)
    const lockedTime =
      props.initialValues.time === undefined
        ? props.position
        : props.initialValues.time + props.offset

    this.containerRef = React.createRef()
    this.state = { lockedTime, emptySpeakerWarningHadBeenShown: false }
  }

  componentDidMount() {
    this.props.incrementFormCount()
    this.containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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

  handleSubmit = (statement) => {
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
      }),
    )
  }

  render() {
    const { position, handleSubmit, valid, speakers, initialValues, handleAbort, t } = this.props
    const currentTime = this.state.lockedTime === false ? position : this.state.lockedTime
    const speaker = initialValues.speaker_id
      ? speakers.find((s) => s.id === initialValues.speaker_id)
      : null
    const LockIcon = this.state.lockedTime === false ? Unlock : Lock

    return (
      <form
        ref={this.containerRef}
        onSubmit={handleSubmit(this.handleSubmit)}
        className={cn('bg-white rounded-lg shadow-lg border border-gray-200', {
          'animate-fadeInDown z-10': !this.props.isBundled,
        })}
      >
        <header className="flex items-center gap-3 p-2 border-b border-gray-200">
          <div className="flex-0 basis-0 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              type="button"
              title={t('statement.reverseTimeLock', {
                context: this.state.lockedTime === false ? 'unlock' : 'lock',
              })}
              onClick={this.toggleLock.bind(this)}
            >
              <LockIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon-xs"
              type="button"
              className="w-6"
              onClick={() => this.moveTimeMarker(currentTime - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <TimeEdit
              time={currentTime}
              handleChange={this.moveTimeMarker}
              onTimeIconClick={() => this.moveTimeMarker(currentTime)}
            />

            <Button
              variant="ghost"
              size="icon-xs"
              type="button"
              className="w-6"
              onClick={() => this.moveTimeMarker(currentTime + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {speaker?.picture ? (
              <img className="h-6 w-6 rounded-full" src={speaker.picture} alt={speaker.name} />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                <Mic size={12} className="text-gray-400" />
              </div>
            )}

            <div>
              <Field
                name="speaker_id"
                component={SpeakersSelect}
                props={{ className: 'text-xs' }}
                speakers={speakers}
                placeholder={t('speaker.add')}
                styles={
                  this.state.emptySpeakerWarningHadBeenShown ? ReactSelectWarningStyles : null
                }
                onChange={() => this.setState({ emptySpeakerWarningHadBeenShown: false })}
              />
            </div>
          </div>
        </header>

        <div className="bg-[#31455d] text-white p-5 shadow-inner flex items-start gap-1">
          <span className="h-[50px] -mt-2 sm:text-7xl text-5xl font-serif text-neutral-300">“</span>
          <Field
            name="text"
            component={ControlTextarea}
            normalize={cleanStrMultiline}
            props={{
              autoFocus: true,
              autosize: true,
              hideErrorIfEmpty: true,
              minLength: STATEMENT_LENGTH[0],
              maxLength: STATEMENT_LENGTH[1],
              placeholder: speaker
                ? t('statement.textPlaceholder')
                : t('statement.noSpeakerTextPlaceholder'),
              warningMessage: this.state.emptySpeakerWarningHadBeenShown
                ? t('statement.noSpeakerWarning')
                : null,
              className:
                'text-lg italic py-1 w-full min-h-[50px] md:text-lg text-white placeholder:text-gray-400 px-1',
            }}
          />
        </div>

        <footer className="flex border-b border-gray-200">
          <Button
            type="submit"
            className="flex-1 rounded-none"
            disabled={!valid || this.props.submitting}
            isLoading={this.props.submitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {t('main:actions.save')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="flex-1 rounded-none border-l border-gray-200"
            disabled={this.props.submitting}
            onClick={handleAbort}
          >
            <Slash className="h-4 w-4 mr-2" />
            {t('main:actions.cancel')}
          </Button>
        </footer>

        <Card className="m-3">
          <CardHeader>
            <CardTitle>{t('statement.helpTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{t('statement.help1')}</p>
            <p>{t('statement.help2')}</p>
            <p>{t('statement.help3')}</p>
            <p>{t('statement.help4')}</p>
            <p>{t('statement.help5')}</p>
            <p>
              <i>{t('statement.help11')}</i>
            </p>
            <p className="font-medium mt-2">{t('statement.help6')}</p>
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
          </CardContent>
        </Card>
      </form>
    )
  }
}
