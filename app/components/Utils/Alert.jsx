import React from 'react'

const Alert = ({ children, type = 'info', ...otherProps }) => (
  <div className={`notification is-${type}`} {...otherProps}>
    {children}
  </div>
)

export default Alert
