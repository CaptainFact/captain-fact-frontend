import React from 'react'
import ControlInput from './ControlInput'

export default props => (
  <div>
    <label className="label">{props.label}</label>
    <ControlInput {...props} />
  </div>
)
