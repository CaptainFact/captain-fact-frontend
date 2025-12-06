import React from 'react'
import Select from 'react-select'

import { cn } from '@/lib/css-utils'

import { ReactSelectTheme, useReactSelectStyles, useReactSelectWarningStyles } from '../../lib/react_select_theme'

const SpeakersSelect = ({ input, speakers, placeholder, styles, className, warning }) => {
  const reactiveStyles = useReactSelectStyles()
  const reactiveWarningStyles = useReactSelectWarningStyles()
  const selectedSpeakerId = input.value
  const speaker = selectedSpeakerId && speakers.find((s) => s.id === selectedSpeakerId)
  const getOption = (speaker) => ({ value: speaker, label: speaker.full_name })
  
  // Use warning styles if warning prop is true, otherwise use provided styles or default reactive styles
  const finalStyles = warning ? reactiveWarningStyles : (styles || reactiveStyles)

  return (
    <Select
      className={cn('whitespace-nowrap', className)}
      placeholder={placeholder}
      options={[...speakers.toJS().map(getOption)]}
      value={speaker ? getOption(speaker) : null}
      name={input.name}
      ignoreAccents
      onBlur={() => input.onBlur(input.value.id)}
      styles={finalStyles}
      theme={ReactSelectTheme}
      onChange={({ value }) => {
        return value && value.id ? input.onChange(value.id) : input.onChange(null)
      }}
    />
  )
}

export default SpeakersSelect
