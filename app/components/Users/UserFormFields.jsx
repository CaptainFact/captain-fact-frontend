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
  if (passwordRepeat !== password) return { passwordRepeat: "Passwords doesn't match" }
  return {}
}

const validateEmail = t => email => {
  return (!email || !isEmail(email)) && t('errors:server.invalid_email')
}

const validatePassword = (t, password) => {
  return validateFieldLength(t, password, PASSWORD_LENGTH)
}

// Common fields

export const emailField = t => (
  <Field
    name="email"
    type="email"
    placeholder={t('email')}
    component={ControlInput}
    icon="envelope"
    normalize={s => s.trim()}
    validate={validateEmail(t)}
  />
)

export const emailOrUsernameField = t => (
  <Field
    name="email"
    type="text"
    placeholder={t('emailOrUsername')}
    component={ControlInput}
    icon="user"
    normalize={s => s.trim()}
  />
)

export const passwordField = (t, isOptional = false) => (
  <Field
    name="password"
    placeholder={t(isOptional ? 'passwordOptional' : 'password')}
    type="password"
    component={ControlInput}
    validate={v => (!v && isOptional ? null : validatePassword(t, v))}
    icon="lock"
  />
)

export const passwordRepeatField = t => (
  <Field
    name="passwordRepeat"
    placeholder={t('repeatPassword')}
    type="password"
    component={ControlInput}
    icon="lock"
  />
)

export const usernameField = t => (
  <Field
    name="username"
    placeholder={t('username')}
    component={ControlInput}
    normalize={s => s.trim()}
    icon="at"
    validate={v => validateFieldLength(t, v, USERNAME_LENGTH)}
  />
)

export const nameField = t => (
  <Field
    name="name"
    placeholder={`${t('realName')} (${t('optional')})`}
    component={ControlInput}
    normalize={cleanStr}
    icon="identity"
    validate={v => v && validateFieldLength(t, v, NAME_LENGTH)}
  />
)

export const submitButton = (text, valid) => (
  <p className="control">
    <Button type="submit" className="is-success is-medium" disabled={!valid}>
      {text}
    </Button>
  </p>
)

export const renderAllUserFields = (valid, t, isPasswdOptional = false) => (
  <div>
    {usernameField(t)}
    {nameField(t)}
    {emailField(t)}
    {passwordField(t, isPasswdOptional)}
    {passwordRepeatField(t)}
  </div>
)
