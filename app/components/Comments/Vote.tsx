import { Ban, ChevronDown, ChevronUp } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Spinner from '../ui/spinner'

const Score = ({ isVoting, isReported, score }) => {
  return (
    <Badge variant="outline" className="min-w-9 h-[22px] justify-center">
      {isVoting ? <Spinner size={13} /> : isReported ? <Ban size={13} /> : <span>{score}</span>}
    </Badge>
  )
}

const Vote = ({ isVoting, score, myVote, onVote, isReported }) => (
  <div className="flex flex-col items-center gap-[2px]">
    <Button
      variant="ghost"
      size="icon-xs"
      className={cn('h-6 w-6 hover:text-green-400', { 'text-green-500': myVote > 0 })}
      onClick={() => (myVote <= 0 ? onVote(1) : onVote(0))}
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
      className={cn('h-6 w-6 hover:text-red-400', { 'text-red-500': myVote < 0 })}
      onClick={() => (myVote >= 0 ? onVote(-1) : onVote(0))}
      aria-label="Downvote"
    >
      <ChevronDown size={24} />
    </Button>
  </div>
)

export default withTranslation('modetation')(Vote)
