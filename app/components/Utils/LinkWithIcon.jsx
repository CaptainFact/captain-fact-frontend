import React from "react"
import { Link } from 'react-router'
import classNames from 'classnames'

import { Icon } from './Icon'


export const LinkWithIcon = ({to, iconName, children, className, ...props}) => (
  <Link to={to} className={classNames('link-with-icon', className)} {...props}>
    <Icon name={iconName} withContainer={false} />
    <span>{children}</span>
  </Link>
)
