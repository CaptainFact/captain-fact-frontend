import React from 'react'

import { cn } from '@/lib/css-utils'

import { Input } from '../ui/input'

const ControlInput = (props) => {
  const {
    icon,
    className,
    meta: { touched, error },
    input,
  } = props

  return (
    <div className={className}>
      <div className="relative">
        <Input
          {...props}
          {...input}
          className={cn({
            'border-red-600': touched && error,
            'pl-10': icon,
          })}
        />
        {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
      </div>
      <div
        className={cn(
          'overflow-hidden transition-[height] duration-200 ease-out',
          touched && error ? 'h-5' : 'h-0',
        )}
      >
        <span className="text-xs text-red-600 pl-1">{error}</span>
      </div>
    </div>
  )
}

export default ControlInput
