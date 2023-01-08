import classNames from 'classnames'
import React from 'react'

export default ({ input, label, placeholder, type, className, meta }) => {
  const { touched, error, submitting } = meta || {}
  return (
    <input
      className={classNames('input', className, {
        'is-danger': touched && error,
      })}
      placeholder={placeholder || label}
      type={type}
      disabled={submitting}
      {...input}
    />
  )
}
