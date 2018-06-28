import React from 'react'
import classNames from 'classnames'
import RawIcon from './RawIcon'


export const ClickableIcon = ({name, size, className, ...otherProps}) => {
  const sizeClass = size && `is-${size}`

  return (
    <a className={classNames('icon', sizeClass, className)} href="#" {...otherProps}>
      <RawIcon name={name}/>
    </a>
  )
}

export default ClickableIcon
