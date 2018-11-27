import React from 'react'
import classNames from 'classnames'
import RawIcon from './RawIcon'

export const Icon = ({ name, size, className, ...otherProps }) => {
  const sizeClass = size && `is-${size}`

  return (
    <span className={classNames('icon', className, sizeClass)} {...otherProps}>
      <RawIcon name={name} />
    </span>
  )
}

export default Icon
