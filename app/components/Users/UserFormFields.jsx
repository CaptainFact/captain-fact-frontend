import React from 'react'
import { Field } from 'redux-form'
import isEmail from 'validator/lib/isEmail'

import { PASSWORD_LENGTH, USERNAME_LENGTH, NAME_LENGTH } from '../../constants'
import { validateFieldLength } from '../../lib/form_validators'
import Button from '../Utils/Button'
import ControlInput from '../FormUtils/ControlInput'
import { cleanStr } from '../../lib/clean_str'

// Common validators for Signup / Login

export const validatePasswordRepeat = ({ password, passwordRepeat }) => {
  if (passwordRepeat !== password) {
    return { passwordRepeat: "Passwords doesn't match" }
  }
  return {}
}

// Common fields

export const UserEmailField = ({ t }) => {
  const validate = React.useCallback(
    (email) => (!email || !isEmail(email)) && t('errors:server.invalid_email'),
    [t]
  )

  return (
    <Field
      name="email"
      type="email"
      placeholder={t('email')}
      component={ControlInput}
      icon="envelope"
      normalize={(s) => s.trim()}
      validate={validate}
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
      icon="user"
      normalize={(s) => s.trim()}
    />
  )
}

export const UserPasswordField = ({ t, isOptional = false }) => {
  const validate = React.useCallback(
    (v) => (!v && isOptional ? null : validateFieldLength(t, v, PASSWORD_LENGTH)),
    [t]
  )
  return (
    <Field
      name="password"
      placeholder={t(isOptional ? 'passwordOptional' : 'password')}
      type="password"
      component={ControlInput}
      validate={validate}
      icon="lock"
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
      icon="lock"
    />
  )
}

export const UserUsernameField = ({ t }) => {
  const validate = React.useCallback((v) => validateFieldLength(t, v, USERNAME_LENGTH), [t])
  return (
    <Field
      name="username"
      placeholder={t('username')}
      component={ControlInput}
      normalize={(s) => s.trim()}
      icon="at"
      validate={validate}
    />
  )
}

export const UserNameField = ({ t }) => {
  const validate = React.useCallback((v) => v && validateFieldLength(t, v, NAME_LENGTH), [t])
  return (
    <Field
      name="name"
      placeholder={`${t('realName')} (${t('optional')})`}
      component={ControlInput}
      normalize={cleanStr}
      icon="identity"
      validate={validate}
    />
  )
}

export const submitButton = (text, valid) => (
  <p className="control">
    <Button type="submit" className="is-success is-medium" disabled={!valid}>
      {text}
    </Button>
  </p>
)

export const renderAllUserFields = (t, isPasswdOptional = false) => (
  <div>
    <UserUsernameField t={t} />
    <UserNameField t={t} />
    <UserEmailField t={t} />
    <UserPasswordField t={t} isOptional={isPasswdOptional} />
    <UserPasswordRepeatField t={t} />
  </div>
)
