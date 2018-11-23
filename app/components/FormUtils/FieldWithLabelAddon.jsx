import React from 'react'
import Button from '../Utils/Button'

export default ({ label, children }) => {
  return (
    <div className="field has-addons">
      <Button>
        {label}
      </Button>
      <div className="select-button">
        {children}
      </div>
    </div>
  )
}
