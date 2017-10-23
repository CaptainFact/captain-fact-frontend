import React from 'react'

const Notification = ({children, type='info'}) =>
  <div className={`notification is-${type}`}>
    {children}
  </div>

export default Notification