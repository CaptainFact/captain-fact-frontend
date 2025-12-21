import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import { ChevronLeft, ChevronRight, Lock, Mic, Save, Slash, Unlock } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'
import { toastError } from '@/lib/toasts'
import { Button } from '@/ui/button'

import { STATEMENT_LENGTH } from '../../constants'
import { cleanStrMultiline } from '../../lib/clean_str'
import { validateFieldLength } from '../../lib/form_validators'
import TextareaAutosize from '../FormUtils/TextareaAutosize'
import TextareaLengthCounter from '../FormUtils/TextareaLengthCounter'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import TimeEdit from '../Utils/TimeEdit'
import SpeakersSelect from './SpeakersSelect'

const CREATE_STATEMENT_MUTATION = gql`
  mutation CreateStatement(
    $videoId: ID!
    $text: String!
    $time: Int!
    $speakerId: ID
    $isDraft: Boolean
  ) {
    createStatement(
      videoId: $videoId
      text: $text
      time: $time
      speakerId: $speakerId
      isDraft: $isDraft
    ) {
      id
      time
      text
      isDraft
      speakerId
      speaker {
        id
      }
      video {
        id
      }
    }
  }
`

const UPDATE_STATEMENT_MUTATION = gql`
  mutation UpdateStatement($id: ID!, $text: String, $time: Int, $speakerId: ID, $isDraft: Boolean) {
    updateStatement(id: $id, text: $text, time: $time, speakerId: $speakerId, isDraft: $isDraft) {
      id
      time
      text
      isDraft
      speakerId
      speaker {
        id
      }
      video {
        id
      }
    }
  }
`

const StatementForm = ({
  offset,
  initialValues,
  speakers,
  onAbort,
  onConfirm,
  onSetScrollTo,
  onSuccess,
  // TODO: THis position is not used anymore
  position = 0,
  videoId,
  t,
}) => {
  const containerRef = useRef(null)
  const [lockedTime, setLockedTime] = useState(
    initialValues.time === undefined ? position : initialValues.time + offset,
  )
  const [emptySpeakerWarningHadBeenShown, setEmptySpeakerWarningHadBeenShown] = useState(false)

  const [createStatement] = useMutation(CREATE_STATEMENT_MUTATION)
  const [updateStatement] = useMutation(UPDATE_STATEMENT_MUTATION)

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const toggleLock = () => {
    if (lockedTime === false) {
      setLockedTime(position || 0)
    } else {
      setLockedTime(false)
    }
  }

  const moveTimeMarker = (newPosition) => {
    if (lockedTime !== false) {
      setLockedTime(newPosition)
    }
  }

  const validate = (values) => {
    const errors = {}
    const textError = validateFieldLength(t, values.text, STATEMENT_LENGTH)
    if (textError) {
      errors.text = textError
    }
    return errors
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const statement = { ...values }

    // Get the best value for statement time and apply the reverse offset
    if (lockedTime !== false) {
      statement.time = lockedTime > offset ? lockedTime - offset : 0
    } else if (position && position > offset) {
      statement.time = position - offset
    } else {
      statement.time = 0
    }

    // Handle speaker warning
    if (!statement.speakerId && !emptySpeakerWarningHadBeenShown) {
      setEmptySpeakerWarningHadBeenShown(true)
      setSubmitting(false)
      return
    } else if (!statement.speakerId) {
      statement.speakerId = null
    }

    try {
      let response
      const isUpdate = initialValues.id !== undefined

      if (isUpdate && onConfirm) {
        // For updates, use onConfirm if provided (for backward compatibility)
        // Ensure id is included in the statement object
        response = await onConfirm({ ...statement, id: initialValues.id })
      } else if (isUpdate) {
        // For updates, use GraphQL mutation
        const result = await updateStatement({
          variables: {
            id: initialValues.id,
            text: statement.text,
            time: statement.time,
            speakerId: statement.speakerId || null,
            isDraft: statement.isDraft || false,
          },
        })
        response = result.data?.updateStatement || { id: initialValues.id }
      } else {
        // For new statements, use GraphQL mutation
        if (!videoId) {
          throw new Error('videoId is required for creating new statements')
        }
        const result = await createStatement({
          variables: {
            videoId: videoId,
            text: statement.text,
            time: statement.time,
            speakerId: statement.speakerId || null,
            isDraft: statement.isDraft || false,
          },
        })
        response = result.data?.createStatement || { success: true }
      }

      setSubmitting(false)
      // The GraphQL subscription will handle adding/updating the statement
      // If we have an ID from the response, scroll to it
      if (response && response.id) {
        onSetScrollTo({ id: response.id, __forceAutoScroll: true })
      }
      // Call onSuccess callback if provided (e.g., to clear the form)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toastError(error)
      setSubmitting(false)
    }
  }

  const currentTime = lockedTime === false ? position : lockedTime
  // Handle both camelCase (from GraphQL) and snake_case (form state)
  // Extract speakerId from either direct property or nested speaker object
  const speakerId = initialValues.speakerId || initialValues.speaker?.id || null
  const speaker = speakerId ? speakers.find((s) => s.id === speakerId) : null
  const LockIcon = lockedTime === false ? Unlock : Lock

  return (
    <Formik
      initialValues={{
        speakerId: speakerId || null,
        text: initialValues.text || '',
        time: initialValues.time,
      }}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <form
          data-cy="statement-form"
          ref={containerRef}
          onSubmit={handleSubmit}
          className={cn(
            'bg-white dark:bg-background rounded-lg shadow-lg dark:shadow-xl border border-gray-200 dark:border-border',
          )}
        >
          <header className="flex items-center gap-3 p-2 border-b border-gray-200 dark:border-border">
            <div className="flex-0 basis-0 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                type="button"
                title={t('statement.reverseTimeLock', {
                  context: lockedTime === false ? 'unlock' : 'lock',
                })}
                onClick={toggleLock}
              >
                <LockIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon-xs"
                type="button"
                className="w-6"
                onClick={() => moveTimeMarker(currentTime - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <TimeEdit
                time={currentTime}
                handleChange={moveTimeMarker}
                onTimeIconClick={() => moveTimeMarker(currentTime)}
              />

              <Button
                variant="ghost"
                size="icon-xs"
                type="button"
                className="w-6"
                onClick={() => moveTimeMarker(currentTime + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {speaker?.picture ? (
                <img
                  className="h-6 w-6 rounded-full"
                  src={speaker.picture}
                  alt={speaker.fullName}
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-accent flex items-center justify-center">
                  <Mic size={12} className="text-gray-400 dark:text-muted-foreground" />
                </div>
              )}

              <div>
                <SpeakersSelect
                  name="speakerId"
                  speakers={speakers}
                  value={values.speakerId}
                  onChange={(value) => {
                    setFieldValue('speakerId', value)
                    setEmptySpeakerWarningHadBeenShown(false)
                  }}
                  onBlur={handleBlur}
                  placeholder={t('speaker.add')}
                  warning={emptySpeakerWarningHadBeenShown}
                />
              </div>
            </div>
          </header>

          <div className="bg-[#31455d] dark:bg-[hsl(210,30%,20%)] text-white dark:text-foreground p-5 shadow-inner flex items-start gap-1">
            <span className="h-[50px] -mt-2 sm:text-7xl text-5xl font-serif text-neutral-300 dark:text-neutral-400">
              “
            </span>
            <div className="flex-1">
              <TextareaAutosize
                name="text"
                value={values.text}
                onChange={(e) => {
                  const cleaned = cleanStrMultiline(e.target.value)
                  setFieldValue('text', cleaned)
                }}
                onBlur={handleBlur}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                placeholder={
                  speaker ? t('statement.textPlaceholder') : t('statement.noSpeakerTextPlaceholder')
                }
                className="text-lg italic py-1 w-full min-h-[50px] md:text-lg text-white dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1 bg-transparent border-0 outline-none resize-none"
              />
              <TextareaLengthCounter
                length={values.text.length}
                minLength={STATEMENT_LENGTH[0]}
                maxLength={STATEMENT_LENGTH[1]}
              />
              {emptySpeakerWarningHadBeenShown && (
                <span className="text-yellow-300 text-sm mt-1 block">
                  {t('statement.noSpeakerWarning')}
                </span>
              )}
              {errors.text && touched.text && (
                <span className="text-red-300 text-sm mt-1 block">{errors.text}</span>
              )}
            </div>
          </div>

          <footer className="flex border-b border-gray-200 dark:border-border">
            <Button
              type="submit"
              className="flex-1 rounded-none"
              disabled={!values.text || isSubmitting}
              isLoading={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {t('main:actions.save')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-none border-l border-gray-200 dark:border-border"
              disabled={isSubmitting}
              onClick={onAbort}
            >
              <Slash className="h-4 w-4 mr-2" />
              {t('main:actions.cancel')}
            </Button>
          </footer>

          <Card className="m-3">
            <CardHeader>
              <CardTitle>{t('statement.helpTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm dark:text-foreground">
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
      )}
    </Formik>
  )
}

export default withTranslation('videoDebate')(StatementForm)
