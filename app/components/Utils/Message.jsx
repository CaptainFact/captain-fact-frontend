import { CircleX } from 'lucide-react'
import PropTypes from 'prop-types'
import React from 'react'

import { cn } from '@/lib/css-utils'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'

// Map old message types to new alert variants
const typeToVariantMap = {
  info: 'info',
  danger: 'destructive',
  warning: 'warning',
  primary: 'default',
  link: 'default',
  dark: 'default',
}

const Message = ({ type, header, className, children, onClose }) => (
  <Alert variant={typeToVariantMap[type]} className={cn('message', `is-${type}`, className)}>
    {(header || onClose) && (
      <AlertTitle className="message-header flex justify-between items-center">
        {header || <div />}
        {onClose && (
          <Button variant="ghost" size="icon-xs" aria-label="delete" onClick={onClose}>
            <CircleX size={16} />
          </Button>
        )}
      </AlertTitle>
    )}
    <AlertDescription className="message-body">{children}</AlertDescription>
  </Alert>
)

Message.propTypes = {
  type: PropTypes.oneOf(['info', 'danger', 'warning', 'primary', 'link', 'dark']),
  onClose: PropTypes.func,
  header: PropTypes.node,
}

Message.defaultProps = {
  type: 'info',
}

export default Message
