import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'

import RawIcon from './RawIcon'

export const LinkWithIcon = ({ to, iconName, children, className, ...props }) => (
  <Link to={to} className={classNames('link-with-icon', className)} {...props}>
    <RawIcon name={iconName} />
    <span>{children}</span>
  </Link>
)
