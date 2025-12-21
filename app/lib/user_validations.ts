import { TFunction } from 'react-i18next'
import isEmail from 'validator/lib/isEmail'

import { NAME_LENGTH, PASSWORD_LENGTH, USERNAME_LENGTH } from '../constants'
import { validateFieldLength } from './form_validators'

/**
 * Form values interface for user forms
 */
interface UserFormValues {
  email?: string
  password?: string
  passwordRepeat?: string
  username?: string
  name?: string
  [key: string]: any
}

/**
 * Validation options for user forms
 */
interface UserFormValidationOptions {
  emailRequired?: boolean
  passwordRequired?: boolean
  includeUsername?: boolean
  includeName?: boolean
  includePasswordRepeat?: boolean
}

/**
 * Validation errors object
 */
interface ValidationErrors {
  [key: string]: string | undefined
}

/**
 * Validates an email field
 */
const validateEmail = (
  t: TFunction,
  email: string | undefined,
  required: boolean = true,
): string | undefined => {
  if (required && (!email || email.trim() === '')) {
    return t('errors:required')
  }
  if (email && !isEmail(email)) {
    return t('errors:server.invalid_email')
  }
  return undefined
}

/**
 * Validates a password field
 */
const validatePassword = (
  t: TFunction,
  password: string | undefined,
  required: boolean = true,
): string | undefined => {
  if (required && (!password || password.trim() === '')) {
    return t('errors:required')
  }
  if (password && password.trim() !== '') {
    return validateFieldLength(t, password, PASSWORD_LENGTH)
  }
  return undefined
}

/**
 * Validates a password repeat field (must match the original password)
 */
const validatePasswordRepeat = (
  t: TFunction,
  passwordRepeat: string | undefined,
  password: string | undefined,
): string | undefined => {
  if (password && passwordRepeat !== password) {
    return t('user:errors.passwordsDontMatch')
  }
  return undefined
}

/**
 * Validates a username field
 */
const validateUsername = (
  t: TFunction,
  username: string | undefined,
): string | undefined => {
  if (!username || username.trim() === '') {
    return t('errors:required')
  }
  return validateFieldLength(t, username, USERNAME_LENGTH)
}

/**
 * Validates a name field (optional)
 */
const validateName = (
  t: TFunction,
  name: string | undefined,
): string | undefined => {
  if (name && name.trim() !== '') {
    return validateFieldLength(t, name, NAME_LENGTH)
  }
  return undefined
}

/**
 * Validates a complete user form with common validations
 */
export const validateUserForm = (
  t: TFunction,
  values: UserFormValues,
  options: UserFormValidationOptions = {},
): ValidationErrors => {
  const {
    emailRequired = true,
    passwordRequired = true,
    includeUsername = false,
    includeName = false,
    includePasswordRepeat = false,
  } = options

  const errors: ValidationErrors = {}

  // Email validation
  const emailError = validateEmail(t, values.email, emailRequired)
  if (emailError) {
    errors.email = emailError
  }

  // Password validation
  const passwordError = validatePassword(t, values.password, passwordRequired)
  if (passwordError) {
    errors.password = passwordError
  }

  // Password repeat validation
  if (includePasswordRepeat) {
    const passwordRepeatError = validatePasswordRepeat(t, values.passwordRepeat, values.password)
    if (passwordRepeatError) {
      errors.passwordRepeat = passwordRepeatError
    }
  }

  // Username validation
  if (includeUsername) {
    const usernameError = validateUsername(t, values.username)
    if (usernameError) {
      errors.username = usernameError
    }
  }

  // Name validation
  if (includeName) {
    const nameError = validateName(t, values.name)
    if (nameError) {
      errors.name = nameError
    }
  }

  return errors
}