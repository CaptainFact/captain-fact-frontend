import React from 'react'
import Select from 'react-select'

const SpeakersSelect = ({ input, speakers, placeholder }) => {
  return (
    <Select
      className="speaker-select"
      onChange={s => (s && s.id ? input.onChange(s.id) : input.onChange(null))}
      onBlur={() => input.onBlur(input.value.id)}
      value={input.value}
      name={input.name}
      placeholder={placeholder}
      labelKey="full_name"
      valueKey="id"
      ignoreAccents
      options={speakers.toJS()}
    />
  )
}

export default SpeakersSelect
