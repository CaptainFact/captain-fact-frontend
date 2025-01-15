import React from 'react'

import { cn } from '@/lib/css-utils'

import TextareaAutosize from './TextareaAutosize'
import TextareaLengthCounter from './TextareaLengthCounter'

const ControlTextarea = (params) => {
  const {
    input,
    label,
    type,
    placeholder,
    autosize,
    minLength,
    maxLength,
    hideErrorIfEmpty,
    meta,
    warningMessage,
    ...props
  } = params
  const { touched, error, submitting, active } = meta
  const hasError = (!hideErrorIfEmpty || input.value.length > 0) && touched && !active && error
  const inputProps = {
    ...input,
    ...props,
    className: cn(props.className, hasError && 'border-red-600'),
    placeholder: placeholder || label,
    disabled: submitting,
    type,
  }
  const textarea = autosize ? <TextareaAutosize {...inputProps} /> : <textarea {...inputProps} />

  return (
    <div className="w-full relative">
      {textarea}
      <TextareaLengthCounter
        length={input.value.length}
        minLength={minLength}
        maxLength={maxLength}
      />
      <div
        className={cn(
          'overflow-hidden transition-[height] duration-200 ease-out',
          hasError ? 'h-5' : 'h-0',
        )}
      >
        <span className="text-sm text-red-500">{error}</span>
      </div>
      {warningMessage && <span>{warningMessage}</span>}
    </div>
  )
}

export default ControlTextarea
