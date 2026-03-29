import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { ShieldBan, ShieldCheck, ShieldQuestion } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { toastError } from '@/lib/toasts'

import {
  loggedInUserPendingModerationCount,
  MODERATE_ACTION_MUTATION,
} from '../../API/graphql_queries'
import {
  MODERATION_ACTION_ABUSIVE,
  MODERATION_ACTION_CONFIRM,
  MODERATION_ACTION_NOTSURE,
} from '../../constants'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import FlagReasonSelect from './FlagReasonSelect'

const ModerationForm = ({ action, onSubmit }) => {
  const { t } = useTranslation('moderation')
  const { loading: userLoading } = useLoggedInUser()
  const [moderateAction, { loading: moderatingLoading }] = useMutation(MODERATE_ACTION_MUTATION, {
    refetchQueries: [{ query: loggedInUserPendingModerationCount }],
  })

  // Convert enum value to integer for moderateAction (which still uses Int!)
  const enumToInt = (enumValue) => {
    const mapping = {
      BAD_LANGUAGE: 1,
      SPAM: 2,
      IRRELEVANT: 3,
      NOT_CONSTRUCTIVE: 4,
    }
    return mapping[enumValue] || parseInt(enumValue, 10)
  }

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await moderateAction({
        variables: {
          actionId: action.id,
          reason: enumToInt(values.reason),
          value: values.value,
        },
      })
      resetForm()
      if (onSubmit) {
        onSubmit()
      }
    } catch (error) {
      toastError(error)
    }
  }

  return (
    <Formik initialValues={{ reason: '', value: null }} onSubmit={handleSubmit} enableReinitialize>
      {({ values, setFieldValue, handleSubmit }) => {
        const getSubmitAction = (value) => () => {
          setFieldValue('value', value)
          handleSubmit()
        }
        return (
          <div>
            <h4 className="text-lg font-medium mb-4 dark:text-foreground">{t('whyReport')}</h4>
            <FlagReasonSelect
              onChange={(value) => setFieldValue('reason', value)}
              value={values.reason}
            />
            <div className="flex gap-2 mt-6 flex-wrap">
              <Button
                className="flex-1"
                variant="outline"
                disabled={!values.reason || userLoading || moderatingLoading}
                onClick={getSubmitAction(MODERATION_ACTION_ABUSIVE)}
                loading={moderatingLoading}
              >
                <ShieldBan size={16} />
                {t('actions.flag_abusive')}
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                disabled={!values.reason || userLoading || moderatingLoading}
                onClick={getSubmitAction(MODERATION_ACTION_NOTSURE)}
                loading={moderatingLoading}
              >
                <ShieldQuestion size={16} />
                {t('actions.unsure')}
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                disabled={!values.reason || userLoading || moderatingLoading}
                onClick={getSubmitAction(MODERATION_ACTION_CONFIRM)}
                loading={moderatingLoading}
              >
                <ShieldCheck size={16} />
                {t('actions.confirm')}
              </Button>
            </div>
          </div>
        )
      }}
    </Formik>
  )
}

export default ModerationForm
