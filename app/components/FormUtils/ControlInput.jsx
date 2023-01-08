import classNames from 'classnames'
import React from 'react'

import Icon from '../Utils/Icon'
import Input from './Input'

const ControlInput = (props) => {
  const {
    icon,
    meta: { touched, error },
  } = props

  return (
    <p className={classNames('control', { 'has-icon': icon })}>
      <Input {...props} />
      {icon && <Icon size="small" name={icon} />}
      {touched && error && <span className="help is-danger">{error}</span>}
    </p>
  )
}

export default ControlInput
