import React from 'react'


const Message = ({type='info', header='', body=''}) =>
  <article className={`message is-${type}`}>
    {header && <div className="message-header">
      {header}
    </div>}
    <div className="message-body">
      {body}
    </div>
  </article>

export default Message