import differenceInSeconds from 'date-fns/differenceInSeconds'
import format from 'date-fns/format'
import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import React, { useEffect, useRef, useState } from 'react'

import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { LocaleDates } from '../../i18n/locale-dates'

const getSecondsSince = (time) => {
  if (!time) {
    return
  } else {
    const parsedTime = typeof time === 'string' ? parseISO(time) : time
    return !parsedTime ? 0 : differenceInSeconds(Date.now(), parsedTime)
  }
}

export const TimeSince = ({ time, addSuffix = true, isDateTime = true, ...props }) => {
  const { locale } = useUserPreferences()
  const [minutesDiff, setMinutesDiff] = useState(() => Math.trunc(getSecondsSince(time) / 60))
  const timeoutRef = useRef(null)

  useEffect(() => {
    const timeoutUpdate = () => {
      const secondsSince = getSecondsSince(time)
      const minutesSince = Math.trunc(secondsSince / 60)

      // Update state
      setMinutesDiff(minutesSince)

      // Configure next timeout
      // Under 1h, update when next minute begin
      if (minutesSince < 60) {
        timeoutRef.current = setTimeout(timeoutUpdate, (60 - (secondsSince % 60)) * 1000)
      }
      // Otherwise update when next hour begin
      else {
        timeoutRef.current = setTimeout(timeoutUpdate, (60 - (minutesSince % 60)) * 60 * 1000)
      }
    }

    timeoutUpdate()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = null
    }
  }, [time])

  // Normalize locale key (e.g., 'pt-BR' -> 'pt_BR') and fallback to 'en' if not found
  const normalizedLocale = locale && typeof locale === 'string' ? locale.replace('-', '_') : 'en'
  let localeObj = LocaleDates[normalizedLocale]

  // Ensure we have a valid locale object with required properties
  if (!localeObj || !localeObj.defaultDateTimeFormat) {
    localeObj = LocaleDates.en
  }

  // Final fallback - if even 'en' doesn't exist, return null
  if (!localeObj || !localeObj.defaultDateTimeFormat) {
    return null
  }

  const dateFormat = isDateTime ? localeObj.defaultDateTimeFormat : localeObj.defaultDateFormat
  const timeAsDate = typeof time === 'string' ? parseISO(time) : time

  if (!timeAsDate || !isFinite(timeAsDate)) {
    return null
  }

  return (
    <span
      title={format(timeAsDate, dateFormat, { locale: localeObj })}
      data-minutes-diff={minutesDiff}
      {...props}
    >
      {distanceInWordsToNow(timeAsDate, { addSuffix, locale: localeObj })}
    </span>
  )
}
