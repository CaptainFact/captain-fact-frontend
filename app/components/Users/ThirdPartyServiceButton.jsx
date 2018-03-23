import React from "react"
import classNames from 'classnames'

import { Icon } from "../Utils"
import RawIcon from '../Utils/RawIcon'


const ThirdPartyServiceButton = ({url, icon, className, newTab=false, ...props}) => (
  <a href={url} target={newTab ? "_BLANK" : ""}
     className={classNames("icon is-large third-party-service-button", className)}
     {...props}>
    <RawIcon name={icon}/>
  </a>
)

export default ThirdPartyServiceButton
