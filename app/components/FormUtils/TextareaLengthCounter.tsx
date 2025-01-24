import React from 'react'

interface TextareaLengthCounterProps {
  length: number
  minLength?: number
  maxLength: number
}

const TextareaLengthCounter: React.FC<TextareaLengthCounterProps> = ({
  length,
  minLength,
  maxLength,
}) => (
  <span
    className="absolute bottom-[2px] right-2 text-[13px] ml-[3px] text-neutral-300"
    data-cy="textarea-length-counter"
  >
    <span
      className={`${length > maxLength ? 'text-red-400' : minLength && length < minLength ? 'text-yellow-600' : ''}`}
    >
      {length}
    </span>
    &nbsp;/ {maxLength}
  </span>
)

export default TextareaLengthCounter
