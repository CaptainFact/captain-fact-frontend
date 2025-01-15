import { Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import formatSeconds from '../../lib/seconds_formatter'
import { Input } from '../ui/input'

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
    <div className="w-[110px] md:w-[30%] md:min-w-[110px]">
      <div className="relative">
        <button
          type="button"
          className="absolute left-2 top-1/2 -translate-y-1/2 p-0 border-0 outline-none bg-transparent cursor-pointer hover:text-gray-600"
          onClick={onTimeIconClick}
        >
          <Clock size={20} />
        </button>
        <Input
          type="text"
          className="pl-8 py-2"
          placeholder="00:00:00"
          value={formattedTime}
          onChange={(e) => handleTimeEdit(e.target.value, setFormattedTime, handleChange)}
        />
      </div>
    </div>
  )
}

export default TimeEdit
