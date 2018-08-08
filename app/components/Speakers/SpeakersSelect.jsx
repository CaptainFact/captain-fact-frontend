import classnames from 'classnames'
import React from 'react'
import Select from 'react-select'


const SpeakersSelect = ({ input, speakers, placeholder, meta, t }) => {
  return (
    <div className="level columns">
      <Select
        className={classnames('speaker select level-item column', { ' is-danger': meta.error })}
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
      {meta.error && (
        <p className="help is-danger level-item column">
          {t('speaker.cantBeBlank')}
        </p>
      )}
    </div >
  )
}

export default SpeakersSelect
