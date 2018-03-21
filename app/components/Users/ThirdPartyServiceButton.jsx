import React from "react"
import classNames from 'classnames'

import { Icon } from "../Utils"


const ThirdPartyServiceButton = ({url, icon, className, newTab=false, ...props}) => (
  <a href={url} target={newTab ? "_BLANK" : ""}
     className={classNames("icon is-large third-party-service-button", className)}
     {...props}>
    <Icon name={icon} withContainer={false}/>
  </a>
)

export default ThirdPartyServiceButton
