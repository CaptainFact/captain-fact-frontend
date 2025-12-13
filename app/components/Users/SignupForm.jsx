import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'

import { toast } from '@/hooks/use-toast'
import { toastError } from '@/lib/toasts'

import { signUp } from '../../API/http_api/current_user'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { validateUserForm } from '../../lib/user_validations'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import { SignInUpContainer } from './SignInUpContainer'
import {
  FormikUserEmailField,
  FormikUserNameField,
  FormikUserPasswordField,
  FormikUserPasswordRepeatField,
  FormikUserUsernameField,
} from './UserFormFields'

const SignupForm = () => {
  const { t } = useTranslation('user')
  const history = useHistory()
  const { locale } = useUserPreferences()
  const { isAuthenticated, loggedInUser, updateLoggedInUser } = useLoggedInUser()

  useEffect(() => {
    // Redirect to user profile when logged in
    if (isAuthenticated && loggedInUser) {
      history.push(`/u/${loggedInUser.username}`)
    }
  }, [isAuthenticated, loggedInUser, history])

  const validateForm = (values) =>
    validateUserForm(t, values, {
      emailRequired: true,
      passwordRequired: true,
      includeUsername: true,
      includeName: true,
      includePasswordRepeat: true,
    })

  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      email: '',
      password: '',
      passwordRepeat: '',
    },
    validate: validateForm,
    onSubmit: async (values) => {
      try {
        const searchParams = new URLSearchParams(location.search)
        const invitationToken = searchParams.get('invitation_token')
        const { user, token } = await signUp({ ...values, locale }, invitationToken)
        updateLoggedInUser(user, token)
        toast({
          variant: 'success',
          title: '🎉 ' + t('signupSuccessTitle'),
          description: t('signupSuccessDescription'),
        })
      } catch (error) {
        if (typeof error === 'string') {
          toastError(error)
        } else {
          // Handle form errors
          if (error && typeof error === 'object') {
            const formikErrors = {}
            Object.keys(error).forEach((key) => {
              formikErrors[key] = error[key]
            })
            formik.setErrors(formikErrors)
          }
        }
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } =
    formik

  return (
    <SignInUpContainer>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <strong>{t('alreadyHaveAccountQuestion')}</strong>{' '}
          <span className="ml-1">
            <Link to="login">{t('login')}</Link>
          </span>
        </div>
        <hr className="mb-6" />
        <div className="space-y-4">
          <FormikUserUsernameField
            t={t}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <FormikUserNameField
            t={t}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <FormikUserEmailField
            t={t}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
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
        </div>
        <p className="text-sm text-gray-600 mb-6 mt-4">
          {t('iAgreeAndAcceptedPrivacy')}{' '}
          <Link to="/help/privacy" className="underline">
            {t('privacyLinkLabel')}
          </Link>
          .
        </p>
        <div className="mt-6">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            className="w-full"
          >
            {t('signup')}
          </Button>
        </div>
      </form>
    </SignInUpContainer>
  )
}

export default SignupForm
