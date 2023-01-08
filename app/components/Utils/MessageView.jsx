import React from 'react'

import Message from './Message'

const MessageView = (props) => (
  <div className="message-view">
    <Message {...props} />
  </div>
)

export default MessageView
