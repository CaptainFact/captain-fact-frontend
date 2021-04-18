import React from 'react'
import Select from 'react-select'
import { ReactSelectStyles, ReactSelectTheme } from '../../lib/react_select_theme'

const SpeakersSelect = ({ input, speakers, placeholder, styles }) => {
  const selectedSpeakerId = input.value
  const speaker = selectedSpeakerId && speakers.find((s) => s.id === selectedSpeakerId)
  const getOption = (speaker) => ({ value: speaker, label: speaker.full_name })

  return (
    <Select
      className="speaker-select"
      placeholder={placeholder}
      options={[...speakers.toJS().map(getOption)]}
      value={speaker ? getOption(speaker) : null}
      name={input.name}
      ignoreAccents
      onBlur={() => input.onBlur(input.value.id)}
      styles={styles ? styles : ReactSelectStyles}
      theme={ReactSelectTheme}
      onChange={({ value }) => {
        return value && value.id ? input.onChange(value.id) : input.onChange(null)
      }}
    />
  )
}

export default SpeakersSelect
