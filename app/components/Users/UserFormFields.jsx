import { AtSign, IdCard, Lock, Mail } from 'lucide-react'
import React from 'react'
import { Field } from 'redux-form'
import isEmail from 'validator/lib/isEmail'

import { NAME_LENGTH, PASSWORD_LENGTH, USERNAME_LENGTH } from '../../constants'
import { cleanStr } from '../../lib/clean_str'
import { validateFieldLength } from '../../lib/form_validators'
import ControlInput from '../FormUtils/ControlInput'
import { Button } from '../ui/button'

// Common validators for Signup / Login

export const validatePasswordRepeat = ({ password, passwordRepeat }) => {
  if (passwordRepeat !== password) {
    return { passwordRepeat: "Passwords don't match" }
  }
  return {}
}

// Common fields

export const UserEmailField = ({ t, ...props }) => {
  const validate = React.useCallback(
    (email) => (!email || !isEmail(email)) && t('errors:server.invalid_email'),
    [t],
  )

  return (
    <Field
      name="email"
      type="email"
      placeholder={t('email')}
      component={ControlInput}
      icon={<Mail size={16} className="text-gray-300" />}
      normalize={(s) => s.trim()}
      validate={validate}
      {...props}
    />
  )
}

export const UserEmailOrUsernameField = ({ t }) => {
  return (
    <Field
      name="email"
      type="text"
      placeholder={t('emailOrUsername')}
      component={ControlInput}
      icon={<IdCard size={16} className="text-gray-300" />}
      normalize={(s) => s.trim()}
    />
  )
}

export const UserPasswordField = ({ t, isOptional = false }) => {
  const validate = React.useCallback(
    (v) => (!v && isOptional ? null : validateFieldLength(t, v, PASSWORD_LENGTH)),
    [t],
  )
  return (
    <Field
      name="password"
      placeholder={t(isOptional ? 'passwordOptional' : 'password')}
      type="password"
      component={ControlInput}
      validate={validate}
      icon={<Lock size={16} className="text-gray-300" />}
    />
  )
}

export const UserPasswordRepeatField = ({ t }) => {
  return (
    <Field
      name="passwordRepeat"
      placeholder={t('repeatPassword')}
      type="password"
      component={ControlInput}
      icon={<Lock size={16} className="text-gray-300" />}
    />
  )
}

const UserUsernameField = ({ t }) => {
  const validate = React.useCallback((v) => validateFieldLength(t, v, USERNAME_LENGTH), [t])
  return (
    <Field
      name="username"
      placeholder={t('username')}
      component={ControlInput}
      normalize={(s) => s.trim()}
      icon={<AtSign size={16} className="text-gray-300" />}
      validate={validate}
    />
  )
}

const UserNameField = ({ t }) => {
  const validate = React.useCallback((v) => v && validateFieldLength(t, v, NAME_LENGTH), [t])
  return (
    <Field
      name="name"
      placeholder={`${t('realName')} (${t('optional')})`}
      component={ControlInput}
      normalize={cleanStr}
      icon={<IdCard size={16} className="text-gray-300" />}
      validate={validate}
    />
  )
}

export const submitButton = (
  text,
  valid,
  { loading = false, size = 'default', variant = 'default' } = {},
) => (
  <div className="mt-6">
    <Button
      type="submit"
      loading={loading}
      disabled={!valid}
      size={size}
      variant={variant}
      className="w-full"
    >
      {text}
    </Button>
  </div>
)

export const renderAllUserFields = (t, isPasswdOptional = false) => (
  <div className="space-y-4">
    <UserUsernameField t={t} />
    <UserNameField t={t} />
    <UserEmailField t={t} />
    <UserPasswordField t={t} isOptional={isPasswdOptional} />
    <UserPasswordRepeatField t={t} />
  </div>
)
