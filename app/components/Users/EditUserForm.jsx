import { useFormik } from 'formik'
import { AtSign, IdCard, Lock, Mail } from 'lucide-react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { toast } from '@/hooks/use-toast'

import { updateUserInfo } from '../../API/http_api/current_user'
import { cleanStr } from '../../lib/clean_str'
import { validateUserForm } from '../../lib/user_validations'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const EditUserForm = () => {
  const { t } = useTranslation('user')
  const history = useHistory()
  const { loggedInUser, loggedInUserLoading, isAuthenticated, updateLoggedInUser } =
    useLoggedInUser()

  useEffect(() => {
    // Redirect to user profile when not authenticated
    if (!loggedInUserLoading && !isAuthenticated) {
      history.push('/')
    }
  }, [loggedInUserLoading, isAuthenticated, history])

  const validateForm = (values) =>
    validateUserForm(t, values, {
      emailRequired: true,
      passwordRequired: false,
      includeUsername: true,
      includeName: true,
      includePasswordRepeat: true,
    })

  const formik = useFormik({
    initialValues: {
      username: loggedInUser?.username || '',
      name: loggedInUser?.name || '',
      email: loggedInUser?.email || '',
      password: '',
      passwordRepeat: '',
    },
    validate: validateForm,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const user = await updateUserInfo(values)
        updateLoggedInUser(user)
        toast({
          variant: 'success',
          title: t('settingsUpdated'),
        })
      } catch (error) {
        // Handle form errors
        if (error && typeof error === 'object') {
          const formikErrors = {}
          Object.keys(error).forEach((key) => {
            formikErrors[key] = error[key]
          })
          formik.setErrors(formikErrors)
        }
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } =
    formik

  return (
    <form className="edit-user-form form flex flex-col gap-2" onSubmit={handleSubmit}>
      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username">{t('username')}</Label>
        <div className="relative">
          <Input
            id="username"
            name="username"
            type="text"
            placeholder={t('username')}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`pl-10 ${touched.username && errors.username ? 'border-red-600' : ''}`}
          />
          <AtSign
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
          />
        </div>
        {touched.username && errors.username && (
          <span className="text-xs text-red-600 pl-1">{errors.username}</span>
        )}
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">
          {t('realName')} ({t('optional')})
        </Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={(e) => {
              handleChange({
                target: { name: 'name', value: cleanStr(e.target.value).trim() },
              })
              handleBlur(e)
            }}
            className={`pl-10 ${touched.name && errors.name ? 'border-red-600' : ''}`}
          />
          <IdCard
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
          />
        </div>
        {touched.name && errors.name && (
          <span className="text-xs text-red-600 pl-1">{errors.name}</span>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`pl-10 ${touched.email && errors.email ? 'border-red-600' : ''}`}
          />
          <Mail
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
          />
        </div>
        {touched.email && errors.email && (
          <span className="text-xs text-red-600 pl-1">{errors.email}</span>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">{t('passwordOptional')}</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`pl-10 ${touched.password && errors.password ? 'border-red-600' : ''}`}
          />
          <Lock
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
          />
        </div>
        {touched.password && errors.password && (
          <span className="text-xs text-red-600 pl-1">{errors.password}</span>
        )}
      </div>

      {/* Password Repeat Field */}
      <div className="space-y-2">
        <Label htmlFor="passwordRepeat">{t('repeatPassword')}</Label>
        <div className="relative">
          <Input
            id="passwordRepeat"
            name="passwordRepeat"
            type="password"
            value={values.passwordRepeat}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`pl-10 ${touched.passwordRepeat && errors.passwordRepeat ? 'border-red-600' : ''}`}
          />
          <Lock
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
          />
        </div>
        {touched.passwordRepeat && errors.passwordRepeat && (
          <span className="text-xs text-red-600 pl-1">{errors.passwordRepeat}</span>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          variant="outline"
          className="w-full"
        >
          {t('main:actions.save')}
        </Button>
      </div>
    </form>
  )
}

export default EditUserForm
