import React from 'react'
import classNames from 'classnames'


const Message = ({type='info', header='', className, children}) =>
  <article className={classNames('message', `is-${type}`, className)}>
    {header && <div className="message-header">
      {header}
    </div>}
    <div className="message-body">
      {children}
    </div>
  </article>

export default Message