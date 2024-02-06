import React from 'react'

import Button from '../Utils/Button'

const FieldWithLabelAddon = ({ label, children, inputId }) => {
  return (
    <div className="field has-addons">
      <label className="control" htmlFor={inputId}>
        <Button className="is-static">{label}</Button>
      </label>
      <div className="control">{children}</div>
    </div>
  )
}

export default FieldWithLabelAddon
