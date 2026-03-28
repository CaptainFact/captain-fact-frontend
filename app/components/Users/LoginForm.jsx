import { useFormik } from 'formik'
import { get } from 'lodash'
import { CircleAlert } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useLocation } from 'react-router-dom'

import { signIn } from '../../API/http_api/current_user'
import { tError } from '../../lib/errors'
import { validateUserForm } from '../../lib/user_validations'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { Alert, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { SignInUpContainer } from './SignInUpContainer'
import { FormikUserEmailOrUsernameField, FormikUserPasswordField } from './UserFormFields'

const getResetUrl = (email) => {
  if (email) {
    return `/reset_password?email=${encodeURIComponent(email)}`
  } else {
    return '/reset_password'
  }
}

const LoginForm = () => {
  const { t } = useTranslation('user')
  const history = useHistory()
  const location = useLocation()
  const { isAuthenticated, updateLoggedInUser } = useLoggedInUser()
  const [error, setError] = useState(null)

  const redirect = () => {
    const pathName = get(location, 'state.redirect', '/videos')
    history.replace(pathName)
  }

  useEffect(() => {
    if (isAuthenticated) {
      redirect()
    }
  }, [isAuthenticated])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) =>
      validateUserForm(t, values, {
        emailRequired: true,
        emailOrUsername: true,
        passwordRequired: true,
      }),
    onSubmit: async (values) => {
      try {
        setError(null)
        const { user, token } = await signIn('identity', values)
        updateLoggedInUser(user, token)
      } catch (error) {
        if (typeof error === 'string') {
          setError(error)
        }
        throw error
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } =
    formik

  return (
    <SignInUpContainer>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <strong>{t('needAnAccountQuestion')}</strong>{' '}
          <span className="ml-1 underline">
            <Link to="/signup">{t('signup')}</Link>
          </span>
        </div>
        <hr className="mb-6" />
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              <CircleAlert size="1em" className="inline mr-2" />
              {tError(t, error)}
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <FormikUserEmailOrUsernameField
            t={t}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            required={true}
          />
          <FormikUserPasswordField
            t={t}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            required={true}
          />
        </div>
        <div className="mt-6">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            className="w-full"
          >
            {t('login')}
          </Button>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <Link className="block text-sm" to={getResetUrl(values.email)}>
            {t('forgottenPassword')}
          </Link>
        </div>
      </form>
    </SignInUpContainer>
  )
}

export default LoginForm
