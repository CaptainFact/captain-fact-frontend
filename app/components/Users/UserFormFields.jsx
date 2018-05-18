import React from 'react'
import { Field } from 'redux-form'
import isEmail from 'validator/lib/isEmail'

import { PASSWORD_LENGTH, USERNAME_LENGTH, NAME_LENGTH } from '../../constants'
import { renderField, cleanStr } from '../FormUtils'
import { validateFieldLength } from '../FormUtils/index'


// Common validator for Signup / Login
export const validatePasswordRepeat = ({password, passwordRepeat}) => {
  if (passwordRepeat !== password)
    return {passwordRepeat: "Passwords doesn't match"}
  return {}
}

const validateEmail = t => email =>
  (!email || !isEmail(email)) && t('errors:server.invalid_email')

// Common fields
export const emailField = t =>
  <Field name="email" placeholder={t('email')}
         component={renderField}
         icon="envelope"
         normalize={s => s.trim()}
         validate={validateEmail(t)}/>

export const passwordField = (t, isOptional=false) =>
  <Field name="password" placeholder={t(isOptional ? 'passwordOptional' : 'password')}
         type="password" component={renderField}
         validate={v => !v && isOptional ? null : validateFieldLength(t, v, PASSWORD_LENGTH)}
         icon="lock"/>

export const passwordRepeatField = (t) =>
  <Field name="passwordRepeat"
         placeholder={t('repeatPassword')}
         type="password"
         component={renderField}
         icon="lock"/>

export const submitButton = (text, valid) =>
  <p className="control">
    <button type="submit" className="button is-success is-medium" disabled={!valid}>
      {text}
    </button>
  </p>

export const renderAllUserFields = (valid, t, isPasswdOptional = false) => (
  <div>
    <Field name="username"
           placeholder={t('username')}
           component={renderField}
           normalize={s => s.trim()}
           icon="at"
           validate={v => validateFieldLength(t, v, USERNAME_LENGTH)}/>
    <Field name="name"
           placeholder={`${t('realName')} (${t('optional')})`}
           component={renderField}
           normalize={cleanStr}
           icon="identity"
          validate={v => v && validateFieldLength(t, v, NAME_LENGTH)}/>
    {emailField(t)}
    {passwordField(t, isPasswdOptional)}
    {passwordRepeatField(t)}
  </div>
)

