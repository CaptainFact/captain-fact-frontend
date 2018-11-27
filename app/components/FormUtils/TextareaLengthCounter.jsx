import React from 'react'

const TextareaLengthCounter = ({ length, maxLength }) => (
  <span className="textarea-length-counter">
    <span className={`value ${length > maxLength ? 'invalid' : ''}`}>{length}</span>
    &nbsp;/ {maxLength}
  </span>
)

export default TextareaLengthCounter
