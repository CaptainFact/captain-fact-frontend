import { Ban, ChevronDown, ChevronUp } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

const Score = ({ isVoting, isReported, score }) => {
  return (
    <Badge
      variant="outline"
      className="min-w-9 h-[22px] justify-center bg-white dark:bg-background dark:text-foreground dark:border-border"
    >
      {isVoting ? (
        <Spinner className="size-3" />
      ) : isReported ? (
        <Ban size={13} />
      ) : (
        <span>{score}</span>
      )}
    </Badge>
  )
}

const Vote = ({ isVoting, score, loggedInUserVote, onVote, isReported }) => (
  <div className="flex flex-col items-center gap-[2px]">
    <Button
      variant="ghost"
      size="icon-xs"
      className={cn('h-6 w-6 hover:text-green-400 dark:hover:text-green-500', {
        'text-green-500 dark:text-green-400': loggedInUserVote > 0,
      })}
      onClick={() => (loggedInUserVote <= 0 ? onVote(1) : onVote(0))}
      aria-label="Upvote"
    >
      <ChevronUp size={24} />
    </Button>
    <div className="text-sm min-h-[1.1em]">
      <Score isVoting={isVoting} isReported={isReported} score={score} />
    </div>
    <Button
      variant="ghost"
      size="icon-xs"
      className={cn('h-6 w-6 hover:text-red-400 dark:hover:text-red-500', {
        'text-red-500 dark:text-red-400': loggedInUserVote < 0,
      })}
      onClick={() => (loggedInUserVote >= 0 ? onVote(-1) : onVote(0))}
      aria-label="Downvote"
    >
      <ChevronDown size={24} />
    </Button>
  </div>
)

export default withTranslation('modetation')(Vote)
