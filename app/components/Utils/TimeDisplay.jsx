import { useVideoPlayback } from 'app/contexts/VideoPlaybackContext'
import { capitalize as doCapitalize } from 'lodash'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'

import formatSeconds from '../../lib/seconds_formatter'
import { Button } from '../ui/button'

const i18nAtKey = 'misc.timeAt'

const PositionButton = ({ time, textClassName, formattedTime }) => {
  const { forcePosition } = useVideoPlayback()
  return (
    <Button
      variant="link"
      className={cn('px-1', textClassName)}
      onClick={() => {
        forcePosition(time)
      }}
    >
      {formattedTime}
    </Button>
  )
}

const TimeDisplay = ({
  time,
  textClassName,
  t,
  withoutPlayback = false,
  textBefore = true,
  capitalize = true,
}) => {
  const formattedTime = formatSeconds(time)
  return (
    <div className={textClassName}>
      {textBefore && (
        <span>
          {capitalize ? doCapitalize(t(i18nAtKey)) : t(i18nAtKey)}
          &nbsp;
        </span>
      )}
      {withoutPlayback ? (
        <span>{formattedTime}</span>
      ) : (
        <PositionButton time={time} textClassName={textClassName} formattedTime={formattedTime} />
      )}
    </div>
  )
}

export default withTranslation('main')(TimeDisplay)
