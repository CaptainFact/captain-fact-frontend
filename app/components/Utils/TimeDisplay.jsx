import { useVideoPlayback } from 'app/contexts/VideoPlaybackContext'
import { capitalize as doCapitalize } from 'lodash'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'

import formatSeconds from '../../lib/seconds_formatter'
import { Button } from '../ui/button'

const i18nAtKey = 'misc.timeAt'

const TimeDisplay = ({ time, textClassName, t, textBefore = true, capitalize = true }) => {
  const { forcePosition } = useVideoPlayback()
  const formattedTime = formatSeconds(time)

  return (
    <div className={textClassName}>
      {textBefore && (
        <span>
          {capitalize ? doCapitalize(t(i18nAtKey)) : t(i18nAtKey)}
          &nbsp;
        </span>
      )}
      <Button
        variant="link"
        className={cn('px-1', textClassName)}
        onClick={() => forcePosition(time)}
      >
        {formattedTime}
      </Button>
    </div>
  )
}

export default withTranslation('main')(TimeDisplay)
