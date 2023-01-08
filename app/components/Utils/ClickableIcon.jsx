import classNames from 'classnames'
import React from 'react'

import UnstyledButton from '../StyledUtils/UnstyledButton'
import RawIcon from './RawIcon'

export const ClickableIcon = ({ name, size, className, ...otherProps }) => {
  const sizeClass = size && `is-${size}`

  return (
    <UnstyledButton className={classNames('icon', sizeClass, className)} {...otherProps}>
      <RawIcon name={name} />
    </UnstyledButton>
  )
}

export default ClickableIcon
