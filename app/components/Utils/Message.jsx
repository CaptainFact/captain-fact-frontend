import React from 'react'


const Message = ({type='info', header='', children}) =>
  <article className={`message is-${type}`}>
    {header && <div className="message-header">
      {header}
    </div>}
    <div className="message-body">
      {children}
    </div>
  </article>

export default Message