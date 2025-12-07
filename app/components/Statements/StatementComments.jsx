import { Users } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/css-utils'

import { classifyComments } from '../../state/video_debate/comments/selectors'
import { CommentsList } from '../Comments/CommentsList'
import { Separator } from '../ui/separator'
import SpeakerComments from './SpeakerComments'

@withTranslation('videoDebate')
@connect((state, props) => {
  const classifiedComments = classifyComments(state, props)
  return {
    comments: classifiedComments.regularComments,
    speakerComments: classifiedComments.selfComments,
    approvingFacts: classifiedComments.approvingFacts,
    refutingFacts: classifiedComments.refutingFacts,
  }
})
export default class StatementComments extends React.PureComponent {
  render() {
    const { speaker, speakerComments, setReplyToComment } = this.props
    return (
      <React.Fragment>
        <SpeakerComments
          setReplyToComment={setReplyToComment}
          speaker={speaker}
          comments={speakerComments}
        />
        {this.renderCommunityComments()}
      </React.Fragment>
    )
  }

  renderCommunityComments() {
    const { t, approvingFacts, refutingFacts, comments, speakerComments } = this.props
    const hasSourcedComments = approvingFacts.size > 0 || refutingFacts.size > 0
    const hasRegularComments = comments.size > 0
    const hasCommunityComments = hasSourcedComments || hasRegularComments
    const hasSpeakerComments = speakerComments.size > 0

    return !hasCommunityComments ? null : (
      <div className="bg-[#fefefe] dark:bg-background">
        {hasSpeakerComments && (
          <div className="bg-neutral-100 dark:bg-accent text-center flex justify-center items-center gap-2 p-1 dark:text-foreground">
            <Users size={14} />
            {t('community')}
          </div>
        )}
        <Separator />
        {hasSourcedComments && this.renderSourcedComments()}
        {hasRegularComments && this.renderRegularComments()}
      </div>
    )
  }

  renderSourcedComments() {
    const { approvingFacts, refutingFacts, setReplyToComment } = this.props
    return (
      <div className="flex flex-wrap shadow-[0_5px_5px_-5px_#bdbdbd] mb-2">
        <CommentsList
          className="w-full md:w-1/2 flex-grow basis-[450px] flex-col bg-red-100/5 pb-2"
          comments={refutingFacts}
          setReplyToComment={setReplyToComment}
          header={this.renderCommentsListHeader(
            'refute',
            'destructive',
            this.calculateScore(refutingFacts),
          )}
          statementID={this.props.statement.id}
          commentType="refute"
        />
        <div className="hidden md:flex items-stretch self-stretch my-2">
          <Separator orientation="vertical" className="bg-neutral-100 dark:bg-border" />
        </div>
        <CommentsList
          className="w-full md:w-1/2 flex-grow basis-[450px] flex-col bg-green-100/5 pb-2"
          comments={approvingFacts}
          setReplyToComment={setReplyToComment}
          header={this.renderCommentsListHeader(
            'approve',
            'success',
            this.calculateScore(approvingFacts),
          )}
          statementID={this.props.statement.id}
          commentType="approve"
        />
      </div>
    )
  }

  renderRegularComments() {
    const { comments, setReplyToComment } = this.props
    return (
      <div className="px-3">
        <CommentsList
          comments={comments}
          setReplyToComment={setReplyToComment}
          header={this.renderCommentsListHeader('comments')}
          className="w-full max-w-full"
        />
      </div>
    )
  }

  renderCommentsListHeader(label, variant, score = null) {
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
          <span>{this.props.t(label)}</span>
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

  calculateScore(comments) {
    return comments.reduce((score, comment) => {
      return score + (comment.score > 0 ? comment.score : 0)
    }, 0)
  }
}
