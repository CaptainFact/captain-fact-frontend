import React from 'react'
import classNames from 'classnames'

const Tag = ({ type, size = 'small', className, children, ...props }) => (
  <div
    className={classNames(
      'tag',
      `is-${size}`,
      type ? `is-${type}` : null,
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export default Tag
