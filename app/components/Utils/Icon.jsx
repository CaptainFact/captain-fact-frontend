import React from "react"
import classNames from 'classnames'


export const Icon = ({name, size, withContainer=true, className, isClickable, ...otherProps}) => {
  const sizeClass = size && `is-${size}`
  const icon = <i className={`fa icon-${name}`}/>

  if (!withContainer)
    return icon

  const Container = isClickable ? 'a' : 'span'
  return (
    <Container className={classNames('icon', className, sizeClass)} {...otherProps}>
      {icon}
    </Container>
  )
}

export default Icon