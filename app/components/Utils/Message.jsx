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
        {header}
        {onClose && <button className="delete" aria-label="delete" onClick={onClose} />}
      </div>
    )}
    <div className="message-body">{children}</div>
  </article>
)

Message.propTypes = {
  type: PropTypes.oneOf(['info', 'danger', 'warning', 'primary', 'link', 'dark']),
  onClose: PropTypes.func,
  header: PropTypes.string
}

Message.defaultProps = {
  type: 'info'
}

export default Message
