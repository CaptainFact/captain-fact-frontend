import React from 'react'
import classNames from 'classnames'
import Button from '../Utils/Button'
import { Icon } from '../Utils/Icon'


const CommentAction = ({className, onClick, title, iconName}) => (
  <Button
    className={classNames('is-inverted is-primary', className)}
    onClick={onClick}
  >
    <Icon name={iconName}/>
    <span>{title}</span>
  </Button>
)

export default CommentAction
