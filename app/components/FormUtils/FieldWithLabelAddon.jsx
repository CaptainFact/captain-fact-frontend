import React from 'react'

const FieldWithLabelAddon = ({ label, children, inputId }) => {
  return (
    <div className="field has-addons">
      <label className="text-sm mb-2 dark:text-foreground" htmlFor={inputId}>
        {label}
      </label>
      <div>{children}</div>
    </div>
  )
}

export default FieldWithLabelAddon
