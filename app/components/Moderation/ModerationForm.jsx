import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { ShieldBan, ShieldCheck, ShieldQuestion } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { MODERATE_ACTION_MUTATION } from '../../API/graphql_queries'
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
  const { user, loading: userLoading } = useLoggedInUser()
  const [moderateAction, { loading: moderatingLoading }] = useMutation(MODERATE_ACTION_MUTATION)

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await moderateAction({
        variables: {
          actionId: action.id,
          reason: parseInt(values.reason, 10),
          value: values.value,
        },
      })
      resetForm()
      if (onSubmit) {
        onSubmit()
      }
    } catch (error) {
      console.error('Error moderating action:', error)
    }
  }

  const submitAction = (value) => (formikProps) => {
    formikProps.setFieldValue('value', value)
    formikProps.handleSubmit()
  }

  return (
    <Formik initialValues={{ reason: '', value: null }} onSubmit={handleSubmit} enableReinitialize>
      {({ values, handleSubmit }) => (
        <div>
          <h4 className="text-lg font-medium mb-4 dark:text-foreground">{t('whyReport')}</h4>
          <FlagReasonSelect />
          <div className="flex gap-2 mt-6 flex-wrap">
            <Button
              className="flex-1"
              variant="outline"
              disabled={!values.reason || userLoading || moderatingLoading}
              onClick={submitAction(MODERATION_ACTION_ABUSIVE)}
              loading={moderatingLoading}
            >
              <ShieldBan size={16} />
              {t('actions.flag_abusive')}
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              disabled={!values.reason || userLoading || moderatingLoading}
              onClick={submitAction(MODERATION_ACTION_NOTSURE)}
              loading={moderatingLoading}
            >
              <ShieldQuestion size={16} />
              {t('actions.unsure')}
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              disabled={!values.reason || userLoading || moderatingLoading}
              onClick={submitAction(MODERATION_ACTION_CONFIRM)}
              loading={moderatingLoading}
            >
              <ShieldCheck size={16} />
              {t('actions.confirm')}
            </Button>
          </div>
        </div>
      )}
    </Formik>
  )
}

export default ModerationForm
