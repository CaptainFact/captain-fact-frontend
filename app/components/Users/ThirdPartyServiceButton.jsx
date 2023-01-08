import classNames from 'classnames'
import React from 'react'

import RawIcon from '../Utils/RawIcon'

const ThirdPartyServiceButton = ({ url, icon, className, newTab = false, ...props }) => (
  <a
    href={url}
    target={newTab ? '_BLANK' : ''}
    rel="noreferrer"
    className={classNames('icon is-large third-party-service-button', className)}
    {...props}
  >
    <RawIcon name={icon} />
  </a>
)

export default ThirdPartyServiceButton
