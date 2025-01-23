import React from 'react'

import { cn } from '@/lib/css-utils'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

const FieldWithButton = (props) => {
  const { submitting, invalid } = props.meta || {}
  const { buttonClassName, buttonLabel, buttonClickHandler, ...inputProps } = props
  return (
    <div className={cn('flex items-center')}>
      <Input
        {...inputProps}
        {...inputProps.input}
        className={cn(inputProps.className, 'rounded-tr-none rounded-br-none', {
          'border-red-500': invalid,
        })}
      />
      <div className="control">
        <Button
          type="submit"
          loading={submitting}
          disabled={submitting || invalid}
          onClick={buttonClickHandler}
          className={cn(buttonClassName, 'rounded-tl-none rounded-bl-none whitespace-nowrap')}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}

export default FieldWithButton
