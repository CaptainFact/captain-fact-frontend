import React from "react"
import classNames from 'classnames'


export const ClickableIcon = ({name, size, ...otherProps}) => {
  const sizeClass = size && `is-${size}`

  return (
    <a className={classNames('icon', sizeClass)} {...otherProps}>
      <i className={`fa icon-${name}`}/>
    </a>
  )
}

export default ClickableIcon