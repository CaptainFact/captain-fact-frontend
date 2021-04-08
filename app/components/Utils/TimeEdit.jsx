import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { themeGet } from 'styled-system'
import { Time } from 'styled-icons/boxicons-regular'
import formatSeconds from '../../lib/seconds_formatter'

const TimeEditContainer = styled.div`
  &&& {
    margin: 0 10px 0 0;
    width: 92px;

    @media (max-width: 768px) {
      min-width: 92px;
      width: 30%;
    }
  }
`

const TimeIconButton = styled.button`
  padding: 0;
  border: 0;
  outline: none;
  background: none;
  cursor: pointer;

  &:hover > ${Time} {
    color: ${themeGet('colors.black.300')};
  }
`

const handleTimeEdit = (newTimeCode, setFormattedTime, handleChange) => {
  setFormattedTime(newTimeCode)
  if (/^[0-9]?[0-9]:[0-5][0-9]:[0-5][0-9]$/.test(newTimeCode)) {
    const index = newTimeCode.indexOf(':')
    const hours = Number(newTimeCode.slice(0, index)) * 60 * 60
    const minutes = Number(newTimeCode.slice(index + 1, index + 3)) * 60
    const seconds = Number(newTimeCode.slice(index + 4, index + 6))
    handleChange(hours + minutes + seconds)
  }
}

const TimeEdit = ({ time, handleChange, onTimeIconClick }) => {
  const [formattedTime, setFormattedTime] = useState('')

  useEffect(() => {
    setFormattedTime(formatSeconds(time))
  }, [time])

  return (
    <TimeEditContainer className="control has-icons-left">
      <TimeIconButton
        type="button"
        className="icon is-left"
        style={{ pointerEvents: 'auto' }}
        onClick={onTimeIconClick}
      >
        <Time size={20} />
      </TimeIconButton>
      <input
        type="text"
        className="input"
        placeholder="00:00:00"
        value={formattedTime}
        onChange={(e) => handleTimeEdit(e.target.value, setFormattedTime, handleChange)}
      />
    </TimeEditContainer>
  )
}

export default TimeEdit
