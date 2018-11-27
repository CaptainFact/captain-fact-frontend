import React from 'react'
import TextareaAutosize from '../FormUtils/TextareaAutosize'
import TextareaLengthCounter from '../FormUtils/TextareaLengthCounter'
import { COMMENT_LENGTH } from '../../constants'

export default ({
  input,
  label,
  placeholder,
  isReply,
  meta: { submitting, error },
  autoFocus = false
}) => (
  <p className="control">
    <TextareaAutosize
      {...input}
      placeholder={placeholder || label}
      disabled={submitting}
      focus={isReply}
      autoFocus={autoFocus}
    />
    <TextareaLengthCounter length={input.value.length} maxLength={COMMENT_LENGTH[1]} />
    {error && (
      <span className="help is-danger">
        {typeof error === 'string' ? error : error[0]}
      </span>
    )}
  </p>
)
