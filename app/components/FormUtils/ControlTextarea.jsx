import React from 'react'
import classNames from 'classnames'
import TextareaAutosize from './TextareaAutosize'
import TextareaLengthCounter from './TextareaLengthCounter'

const ControlTextarea = (params) => {
  const {
    input,
    label,
    icon,
    type,
    placeholder,
    autosize,
    maxLength,
    hideErrorIfEmpty,
    meta: { touched, error, submitting },
    warningMessage,
    ...props
  } = params
  const hasError = (!hideErrorIfEmpty || input.value.length > 0) && touched && error
  const inputProps = {
    ...input,
    ...props,
    className: classNames('textarea', { 'is-danger': hasError }),
    placeholder: placeholder || label,
    disabled: submitting,
    type,
  }
  const textarea = autosize ? <TextareaAutosize {...inputProps} /> : <textarea {...inputProps} />

  return (
    <p className={classNames('control', { 'has-icon': !!icon })}>
      {textarea}
      <TextareaLengthCounter length={input.value.length} maxLength={maxLength} />
      {hasError && <span className="help is-danger">{error}</span>}
      {warningMessage && <span className="help is-warning">{warningMessage}</span>}
    </p>
  )
}

export default ControlTextarea
