import { Users } from 'lucide-react'
import React, { useMemo } from 'react'
import { withTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/css-utils'

import CommentsList from '../../Comments/CommentsList'
import { Separator } from '../../ui/separator'
import SpeakerComments from '../SpeakerComments'
import { classifyComments } from '../utils'

// Sort comments by score (descending) and then by insertion time
const sortComments = (comments) => {
  return [...comments].sort((a, b) => {
    // First sort by score (descending)
    if (b.score !== a.score) {
      return (b.score || 0) - (a.score || 0)
    }
    // Then by insertion time (ascending - older first)
    const aTime = a.insertedAt || 0
    const bTime = b.insertedAt || 0
    return aTime - bTime
  })
}

// Group comments into top-level and replies
const groupComments = (comments) => {
  const topLevel = []
  const repliesByParent = {}

  comments.forEach((comment) => {
    if (comment.replyToId) {
      // This is a reply
      const parentId = comment.replyToId
      if (!repliesByParent[parentId]) {
        repliesByParent[parentId] = []
      }
      repliesByParent[parentId].push(comment)
    } else {
      // This is a top-level comment
      topLevel.push(comment)
    }
  })

  // Sort top-level comments
  const sortedTopLevel = sortComments(topLevel)

  // Sort replies for each parent
  Object.keys(repliesByParent).forEach((parentId) => {
    repliesByParent[parentId] = sortComments(repliesByParent[parentId])
  })

  return { topLevel: sortedTopLevel, repliesByParent }
}

const StatementComments = ({ statement, speaker, setReplyToComment, votesMap, t }) => {
  const comments = statement.comments || []

  // Group comments into top-level and replies (memoized)
  const { topLevel, repliesByParent } = useMemo(() => groupComments(comments), [comments])

  // Classify top-level comments only (memoized)
  const classifiedComments = useMemo(
    () => classifyComments(topLevel, statement.speaker?.id),
    [topLevel, statement.speaker?.id],
  )

  const { regularComments, selfComments, approvingFacts, refutingFacts } = classifiedComments

  const hasSourcedComments = approvingFacts.length > 0 || refutingFacts.length > 0
  const hasRegularComments = regularComments.length > 0
  const hasCommunityComments = hasSourcedComments || hasRegularComments
  const hasSpeakerComments = selfComments.length > 0

  const renderCommentsListHeader = (label, variant, score = null) => {
    const separatorClassName = cn(
      'flex-1 mx-2',
      variant === 'destructive'
        ? 'bg-red-800/30 dark:bg-red-900/40'
        : variant === 'success'
          ? 'bg-green-700/30 dark:bg-green-800/40'
          : '',
    )
    return (
      <div className="flex mt-2 mb-3 items-center">
        <Separator className={separatorClassName} />
        <div className="flex items-center gap-2 font-bold dark:text-foreground">
          <span>{t(label)}</span>
          {score !== null && (
            <Badge variant={variant} className="rounded-full px-4">
              {score}
            </Badge>
          )}
        </div>
        <Separator className={separatorClassName} />
      </div>
    )
  }

  const calculateScore = (comments) => {
    return comments.reduce((score, comment) => {
      return score + (comment.score > 0 ? comment.score : 0)
    }, 0)
  }

  if (!hasCommunityComments) {
    return (
      <React.Fragment>
        <SpeakerComments
          setReplyToComment={setReplyToComment}
          speaker={speaker}
          comments={selfComments}
          repliesByParent={repliesByParent}
          votesMap={votesMap}
        />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <SpeakerComments
        setReplyToComment={setReplyToComment}
        speaker={speaker}
        comments={selfComments}
        repliesByParent={repliesByParent}
        votesMap={votesMap}
      />
      <div className="bg-[#fefefe] dark:bg-background">
        {hasSpeakerComments && (
          <div className="bg-neutral-100 dark:bg-accent text-center flex justify-center items-center gap-2 p-1 dark:text-foreground">
            <Users size={14} />
            {t('community')}
          </div>
        )}
        <Separator />
        {hasSourcedComments && (
          <div className="flex flex-wrap shadow-[0_5px_5px_-5px_#bdbdbd] mb-2">
            <CommentsList
              className="w-full md:w-1/2 flex-grow basis-[450px] flex-col bg-red-100/5 pb-2"
              comments={refutingFacts}
              setReplyToComment={setReplyToComment}
              header={renderCommentsListHeader(
                'refute',
                'destructive',
                calculateScore(refutingFacts),
              )}
              statementID={statement.id}
              commentType="refute"
              repliesByParent={repliesByParent}
              votesMap={votesMap}
            />
            <div className="hidden md:flex items-stretch self-stretch my-2">
              <Separator orientation="vertical" className="bg-neutral-100 dark:border-border" />
            </div>
            <CommentsList
              className="w-full md:w-1/2 flex-grow basis-[450px] flex-col bg-green-100/5 pb-2"
              comments={approvingFacts}
              setReplyToComment={setReplyToComment}
              header={renderCommentsListHeader(
                'approve',
                'success',
                calculateScore(approvingFacts),
              )}
              statementID={statement.id}
              commentType="approve"
              repliesByParent={repliesByParent}
              votesMap={votesMap}
            />
          </div>
        )}
        {hasRegularComments && (
          <div className="px-3">
            <CommentsList
              comments={regularComments}
              setReplyToComment={setReplyToComment}
              header={renderCommentsListHeader('comments')}
              className="w-full max-w-full"
              repliesByParent={repliesByParent}
              votesMap={votesMap}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default withTranslation('videoDebate')(StatementComments)
