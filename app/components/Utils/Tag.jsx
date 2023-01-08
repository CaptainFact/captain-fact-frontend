import classNames from 'classnames'
import React from 'react'

const Tag = ({ type, size = 'small', className, children, ...props }) => (
  <div
    className={classNames('tag', `is-${size}`, type ? `is-${type}` : null, className)}
    {...props}
  >
    {children}
  </div>
)

export default Tag
