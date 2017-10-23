import React from "react"
import classNames from 'classnames'

import { Icon } from "../Utils"


const ThirdPartyServiceButton = ({url, icon, className, newTab=false}) => (
  <a href={url} target={newTab ? "_BLANK" : ""}
     className={classNames("icon is-large third-party-service-button", className)}>
    <Icon name={icon} withContainer={false}/>
  </a>
)

export default ThirdPartyServiceButton
