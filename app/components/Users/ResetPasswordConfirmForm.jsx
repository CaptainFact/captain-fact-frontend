import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import * as userAPI from '../../API/http_api/current_user'
import { USER_PICTURE_XLARGE } from '../../constants'
import { validateUserForm } from '../../lib/user_validations'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import UserAppellation from './UserAppellation'
import { FormikUserPasswordField, FormikUserPasswordRepeatField } from './UserFormFields'
import UserPicture from './UserPicture'

const ResetPasswordConfirmForm = () => {
  const { t } = useTranslation('user')
  const { token } = useParams()
  const { updateLoggedInUser } = useLoggedInUser()
  const [status, setStatus] = useState('waiting_verification')
  const [user, setUser] = useState(null)

  useEffect(() => {
    userAPI
      .resetPasswordVerify(token)
      .then((user) => {
        setStatus('confirm')
        setUser(user)
      })
      .catch(() => {
        setStatus('error')
        setUser('invalid_token')
      })
  }, [token])

  const validateForm = (values) =>
    validateUserForm(t, values, {
      passwordRequired: true,
      includePasswordRepeat: true,
      emailRequired: false,
    })

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordRepeat: '',
    },
    validate: validateForm,
    onSubmit: async (values) => {
      try {
        const user = await userAPI.resetPasswordConfirm(token, values.password)
        const { user: signedInUser, token: authToken } = await userAPI.signIn('identity', {
          ...user,
          password: values.password,
        })
        updateLoggedInUser(signedInUser, authToken)
        setStatus('confirm_success')
      } catch {
        setStatus('error')
        setUser('reset_failed')
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } =
    formik

  const renderContent = () => {
    if (status === 'error') {
      return <ErrorView error={user} i18nNS="user:errors.error" canGoBack={false} />
    } else if (status === 'waiting_verification') {
      return <LoadingFrame />
    } else if (status === 'confirm') {
      return (
        <div className="px-2 my-12">
          <Card className="max-w-[500px] mx-auto">
            <CardHeader>
              <CardTitle>{t('resetPassword')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-3">
                <UserPicture user={user} size={USER_PICTURE_XLARGE} />
                <UserAppellation user={user} withoutActions />
              </div>
              <div className="flex flex-col gap-3 border-t pt-4 mt-4">
                <FormikUserPasswordField
                  t={t}
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                <FormikUserPasswordRepeatField
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
            </CardContent>
          </Card>
        </div>
      )
    } else if (status === 'confirm_success') {
      return <div className="px-2 my-12">{t('resetPasswordSuccess')}</div>
    } else {
      return null
    }
  }

  return (
    <form className="max-w-md mx-auto p-6" onSubmit={handleSubmit}>
      {renderContent()}
    </form>
  )
}

export default ResetPasswordConfirmForm
