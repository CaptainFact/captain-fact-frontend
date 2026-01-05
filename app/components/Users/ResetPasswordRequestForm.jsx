import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import isEmail from 'validator/lib/isEmail'

import { resetPasswordRequest } from '../../API/http_api/current_user'
import { validateUserForm } from '../../lib/user_validations'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ErrorView } from '../Utils/ErrorView'
import { FormikUserEmailField } from './UserFormFields'

const getDefaultEmail = (emailParam) => {
  const decodedEmail = decodeURIComponent(emailParam)
  if (decodedEmail && isEmail(decodedEmail)) {
    return decodedEmail
  }
  return ''
}

const ResetPasswordRequestForm = () => {
  const { t } = useTranslation('user')
  const location = useLocation()
  const history = useHistory()
  const { isAuthenticated } = useLoggedInUser()
  const [status, setStatus] = useState('ready')
  const [error, setError] = useState(null)
  const queryParams = new URLSearchParams(location.search)

  useEffect(() => {
    if (isAuthenticated) {
      history.replace('/')
    }
  }, [isAuthenticated, history])

  const formik = useFormik({
    initialValues: {
      email: getDefaultEmail(queryParams.get('email')),
    },
    validate: (values) =>
      validateUserForm(t, values, { emailRequired: true, passwordRequired: false }),
    onSubmit: async (values) => {
      try {
        await resetPasswordRequest(values.email)
        setStatus('done')
      } catch {
        setStatus('error')
        setError('reset_failed')
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } =
    formik

  const renderContent = () => {
    if (status === 'error') {
      return <ErrorView error={error} i18nNS="user:errors.error" canGoBack={false} />
    } else if (status === 'ready') {
      return (
        <div className="space-y-4">
          <FormikUserEmailField
            t={t}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            {t('resetPassword')}
          </Button>
        </div>
      )
    } else if (status === 'done') {
      return t('resetPasswordRequestSuccess')
    } else {
      return null
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="px-2 my-12">
      <Card className="max-w-[500px] mx-auto">
        <CardHeader>
          <CardTitle>{t('resetPassword')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>{renderContent()}</form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordRequestForm
