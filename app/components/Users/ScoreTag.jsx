import { Star } from 'lucide-react'
import React from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/css-utils'

import { Badge } from '../ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

function getTagType(reputation) {
  if (reputation < 0) {
    return 'destructive'
  } else {
    return 'standard'
  }
}

const ScoreTag = ({ reputation, withIcon = false, className = undefined }) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger>
      <Badge
        variant={getTagType(reputation)}
        className={cn(
          reputation > 0 ? 'bg-white' : 'bg-destructive',
          'animated-border-score py-1',
          className,
        )}
      >
        {withIcon && <Star size="1em" className="mr-1 text-neutral-500 fill-yellow-200" />}
        {reputation}
      </Badge>
    </TooltipTrigger>
    <TooltipContent className="max-w-[300px]">
      <Trans i18nKey="user:reputationTooltip">
        Reputation is a measurement of how much the community trusts you; it is earned by
        participating and is increased by other members voting on your contributions.{' '}
        <Link className="underline text-white" to="/help/reputation">
          Learn more
        </Link>
        .
      </Trans>
    </TooltipContent>
  </Tooltip>
)

export default ScoreTag
