import React from 'react'
import classNames from 'classnames'

import RawIcon from '../Utils/RawIcon'


const ThirdPartyServiceButton = ({
  url,
  icon,
  className,
  name,
  label,
  newTab = false,
  ...props
}) => (
  <a
    href={url}
    target={newTab ? '_BLANK' : ''}
    aria-label={label}
    className={classNames('icon is-large third-party-service-button', className)}
    {...props}
  >
    <RawIcon name={icon}/>
  </a>
)

export default ThirdPartyServiceButton
