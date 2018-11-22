import React from "react"
import { Icon } from "../Utils/Icon"

export default ({ iconName, label }) => (
  <div className="sourcesType">
    <Icon name={iconName} /> {label}
  </div>
)
