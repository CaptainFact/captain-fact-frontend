import { capitalize as doCapitalize } from 'lodash'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'

import formatSeconds from '../../lib/seconds_formatter'
import { Button } from '../ui/button'

const i18nAtKey = 'misc.timeAt'

const TimeDisplay = ({
  time,
  textClassName,
  handleClick,
  t,
  textBefore = true,
  capitalize = true,
}) => {
  const formattedTime = formatSeconds(time)
  const content = handleClick ? (
    <Button variant="link" className={cn('px-1', textClassName)} onClick={() => handleClick(time)}>
      {formattedTime}
    </Button>
  ) : (
    formattedTime
  )
  return (
    <div className={textClassName}>
      {textBefore && (
        <span>
          {capitalize ? doCapitalize(t(i18nAtKey)) : t(i18nAtKey)}
          &nbsp;
        </span>
      )}
      {content}
    </div>
  )
}

export default withTranslation('main')(TimeDisplay)
