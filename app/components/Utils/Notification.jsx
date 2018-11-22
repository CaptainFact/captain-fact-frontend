import React from 'react'

const Notification = ({ children, type = 'info', ...otherProps }) => (
  <div className={`notification is-${type}`} {...otherProps}>
    {children}
  </div>
)

export default Notification
