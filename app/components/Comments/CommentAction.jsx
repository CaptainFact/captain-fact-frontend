import React from 'react'

import { Button } from '../ui/button'

const CommentAction = ({ className, variant = 'link', onClick, title, icon = null, disabled }) => (
  <Button variant={variant} size="xs" className={className} onClick={onClick} disabled={disabled}>
    {icon}
    <span>{title}</span>
  </Button>
)

export default CommentAction
