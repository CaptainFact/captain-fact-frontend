import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

/**
 * See https://bulma.io/documentation/components/message/
 */
const Message = ({ type, header, className, children, onClose }) => (
  <article className={classNames('message', `is-${type}`, className)}>
    {(header || onClose) && (
      <div className="message-header">
        {header || <div />}
        {onClose && <button className="delete" aria-label="delete" onClick={onClose} />}
      </div>
    )}
    <div className="message-body">{children}</div>
  </article>
)

Message.propTypes = {
  type: PropTypes.oneOf(['info', 'danger', 'warning', 'primary', 'link', 'dark']),
  onClose: PropTypes.func,
  header: PropTypes.node
}

Message.defaultProps = {
  type: 'info'
}

export default Message
