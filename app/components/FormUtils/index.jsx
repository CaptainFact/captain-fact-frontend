/**
* Removes multiple spaces, tabs and trim on left
* @param {String} str
* @return {String} clean string
*/
import React from "react"
import capitalize from "voca/capitalize"
import trimLeft from "voca/trim_left"
import classNames from "classnames"
import TextareaAutosize from './TextareaAutosize'
import { Icon } from '../Utils/Icon'


export const renderInput = ({ input, label, placeholder, type, className, meta }) => {
  const { touched, error, submitting } = (meta || {})
  return (
    <input  className={classNames('input', className, {'is-danger': touched && error})}
          {...input}
          placeholder={placeholder ? placeholder : label}
          type={type}
          disabled={submitting}
    />
  )
}

export const renderField = (params) => {
  const { icon, meta: { touched, error } } = params
  return (
    <p className={`control ${icon ? 'has-icon' : ''}`}>
      {renderInput(params)}
      {icon &&
        <Icon size="small" name={icon}/>
      }
      {touched && ((error && <span className='help is-danger'>{error}</span>))}
    </p>
  )
}

export const renderTextareaField = (params) => {
  const {
    input, label, icon, type, placeholder, autosize,
    meta: { touched, error, submitting },
    ...props
  } = params
  const inputProps = {
    ...input,
    ...props,
    className: classNames('textarea', {'is-danger': touched && error}),
    placeholder: placeholder ? placeholder : label,
    disabled: submitting,
    type
  }
  const textarea = autosize ? (<TextareaAutosize {...inputProps}/>) : (<textarea {...inputProps}/>)
  return (
    <p className={`control ${icon ? 'has-icon' : ''}`}>
      { textarea }
      {touched && error &&
      <span className='help is-danger'>{ error }</span>
      }
    </p>
  )
}

export const renderFieldWithLabel = (params) => (
  <div>
    <label className="label">{params.label}</label>
    { renderField(params) }
  </div>
)

export const FieldWithButton = (params) => {
  const { submitting, invalid } = params.meta || {}
  const { buttonClassName, buttonLabel, buttonClickHandler, ...inputProps } = params
  return (
    <div>
      <p className="control has-addons">
        { renderInput(inputProps) }
        <button type="submit"
          className={classNames('button', buttonClassName, {'is-loading': submitting})}
          disabled={ submitting || invalid }
          onClick={buttonClickHandler}>
            { buttonLabel }
        </button>
      </p>
    </div>
  )
}

export const checkLength = (value, range) =>
  value && value.length >= range[0] && (range[1] === -1 || value.length <= range[1])

// TODO Migrate to validateLengthI18n
export const validateLength = (errors, fieldName, value, range, label=null) => {
  if (checkLength(value, range))
    return true
  const fieldLabel = label || capitalize(fieldName.replace('_', ' '))
  if (!value || value.length < range[0])
    errors[fieldName] = `${fieldLabel} must be at least ${range[0]} characters`
  else if (range[1] !== -1 && value.length > range[1])
    errors[fieldName] = `${fieldLabel} must be at most ${range[1]} characters`
  return false
}

export const validateLengthI18n = (t, errors, fieldName, value, range) => {
  if (checkLength(value, range))
    return true
  if (!value || value.length < range[0])
    errors[fieldName] = t('main:misc.fieldMinLength', {min: range[0]})
  else if (range[1] !== -1 && value.length > range[1])
    errors[fieldName] = t('main:misc.fieldMaxLength', {max: range[1]})
  return false
}

export const validateFieldLength = (t, value, range) => {
  if (checkLength(value, range))
    return false
  if (!value || value.length < range[0])
    return t('main:misc.fieldMinLength', {min: range[0]})
  else if (range[1] !== -1 && value.length > range[1])
    return t('main:misc.fieldMaxLength', {max: range[1]})
  return false
}

export const cleanStr = (str) =>
  trimLeft(str.replace(/\s{2,}/g, ' '))

/**
* Same as cleanStr but preserve multiple lines.
* Only on empty line allowed
* @param {String} str
* @return {String} clean string
*/
export const cleanStrMultiline = str =>
  trimLeft(
    str.replace(/(\s(?!\n)){2,}/g, ' ') // Trim spaces / tabs
       .replace(/\n{3,}/g, '\n\n') // Trim newline characters
  )
