import React from 'react'
import classNames from 'classnames'


const Button = ({children, className, onClick, type = 'button'}) => (
  <button
    className={classNames('button', className)}
    type={type}
    onClick={onClick}
  >
    {children}
  </button>
)

export default Button
