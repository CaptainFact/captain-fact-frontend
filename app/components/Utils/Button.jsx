import React from 'react'
import classNames from 'classnames'


/* eslint-disable react/button-has-type */

const Button = ({ className, type = 'button', ...props }) => (
  <button
    className={classNames('button', className)}
    type={type}
    {...props}
  />
)

export default Button
