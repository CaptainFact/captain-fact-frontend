import { capitalize as doCapitalize } from 'lodash'
import React from 'react'
import { withNamespaces } from 'react-i18next'

import formatSeconds from '../../lib/seconds_formatter'
import UnstyledButton from '../StyledUtils/UnstyledButton'

const i18nAtKey = 'misc.timeAt'

const TimeDisplay = ({ time, handleClick, t, textBefore = true, capitalize = true }) => {
  const formattedTime = formatSeconds(time)
  const content = handleClick ? (
    <UnstyledButton onClick={() => handleClick(time)} $asLink>
      {formattedTime}
    </UnstyledButton>
  ) : (
    formattedTime
  )
  return (
    <span className="time-display">
      {textBefore && (
        <span>
          {capitalize ? doCapitalize(t(i18nAtKey)) : t(i18nAtKey)}
          &nbsp;
        </span>
      )}
      {content}
    </span>
  )
}

export default withNamespaces('main')(TimeDisplay)
