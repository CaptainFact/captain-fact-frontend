import React from 'react'
import Select from 'react-select'

import { cn } from '@/lib/css-utils'

import {
  ReactSelectTheme,
  useReactSelectStyles,
  useReactSelectWarningStyles,
} from '../../lib/react_select_theme'

const SpeakersSelectV2 = ({
  speakers,
  value,
  onChange,
  onBlur,
  placeholder,
  warning,
  className,
}) => {
  const reactiveStyles = useReactSelectStyles()
  const reactiveWarningStyles = useReactSelectWarningStyles()
  const speaker = value && speakers.find((s) => s.id === value)
  const getOption = (speaker) => ({ value: speaker.id, label: speaker.fullName })

  // Use warning styles if warning prop is true, otherwise use default reactive styles
  const finalStyles = warning ? reactiveWarningStyles : reactiveStyles

  return (
    <Select
      className={cn('whitespace-nowrap', className)}
      placeholder={placeholder}
      options={speakers.map(getOption)}
      value={speaker ? getOption(speaker) : null}
      ignoreAccents
      onBlur={onBlur}
      styles={finalStyles}
      theme={ReactSelectTheme}
      onChange={(option) => {
        return option && option.value ? onChange(option.value) : onChange(null)
      }}
    />
  )
}

export default SpeakersSelectV2
