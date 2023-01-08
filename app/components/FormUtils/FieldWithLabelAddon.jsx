import React from 'react'

import Button from '../Utils/Button'

const FieldWithLabelAddon = ({ label, children }) => {
  return (
    <div className="field has-addons">
      <p className="control">
        <Button className="is-static">{label}</Button>
      </p>
      <div className="control">{children}</div>
    </div>
  )
}

export default FieldWithLabelAddon
