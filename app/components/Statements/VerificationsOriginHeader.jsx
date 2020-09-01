import React from 'react'
import { Icon } from '../Utils/Icon'

const VerificationsOriginHeader = ({ iconName, label }) => (
  <div className="sourcesType">
    <Icon name={iconName} /> {label}
  </div>
)

export default VerificationsOriginHeader
