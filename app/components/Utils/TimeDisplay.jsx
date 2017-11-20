import React from "react"
import doCapitalize from 'voca/capitalize'

import formatSeconds from "../../lib/seconds_formatter"
import { translate } from 'react-i18next'


const i18nAtKey = 'misc.timeAt'

const TimeDisplay = ({ time, handleClick, t, textBefore=true, capitalize=true }) => {
  const formattedTime = formatSeconds(time)
  const content = handleClick ?
    <a onClick={() => handleClick(time)}>{ formattedTime }</a> : formattedTime
  return (
    <span className="time-display">
      {textBefore &&
        <span>
          {capitalize ? doCapitalize(t(i18nAtKey)) : t(i18nAtKey)}
          &nbsp;
        </span>
      }
      { content }
    </span>
  )
}

export default translate('main')(TimeDisplay)