import React from "react"
import classNames from 'classnames'


export const ClickableIcon = ({name, size, className, ...otherProps}) => {
  const sizeClass = size && `is-${size}`

  return (
    <a className={classNames('icon', sizeClass, className)} {...otherProps}>
      <i className={`fa icon-${name}`}/>
    </a>
  )
}

export default ClickableIcon