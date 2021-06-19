import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import { CommentsList } from '../Comments'

import { classifyComments } from '../../state/video_debate/comments/selectors'
import Tag from '../Utils/Tag'
import VerificationsOriginHeader from './VerificationsOriginHeader'
import SpeakerComments from './SpeakerComments'

@withNamespaces('videoDebate')
@connect((state, props) => {
  if (props.comments === undefined
  || props.speakerComments === undefined
  || props.approvingFacts === undefined
  || props.refutingFacts === undefined) {
    const classifiedComments = classifyComments(state, props)
    return {
      comments: classifiedComments.regularComments,
      speakerComments: classifiedComments.selfComments,
      approvingFacts: classifiedComments.approvingFacts,
      refutingFacts: classifiedComments.refutingFacts,
    }
  } else {
    return { }
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
    const { t, approvingFacts, refutingFacts, comments } = this.props
    const hasSourcedComments = approvingFacts.size > 0 || refutingFacts.size > 0
    const hasRegularComments = comments.size > 0
    const hasCommunityComments = hasSourcedComments || hasRegularComments

    return !hasCommunityComments ? null : (
      <React.Fragment>
        <VerificationsOriginHeader iconName="users" label={t('community')} />
        {hasSourcedComments && this.renderSourcedComments()}
        {hasRegularComments && this.renderRegularComments()}
      </React.Fragment>
    )
  }

  renderSourcedComments() {
    const { approvingFacts, refutingFacts, setReplyToComment } = this.props
    return (
      <div className="card-footer sourced-comments">
        <CommentsList
          className="card-footer-item refute"
          comments={refutingFacts}
          setReplyToComment={setReplyToComment}
          header={this.renderCommentsListHeader(
            'refute',
            'danger',
            this.calculateScore(refutingFacts)
          )}
          statementID={this.props.statement.id}
          commentType="refute"
        />
        <CommentsList
          className="card-footer-item approve"
          comments={approvingFacts}
          setReplyToComment={setReplyToComment}
          header={this.renderCommentsListHeader(
            'approve',
            'success',
            this.calculateScore(approvingFacts)
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
      <div className="card-footer comments">
        <CommentsList
          comments={comments}
          setReplyToComment={setReplyToComment}
          header={this.renderCommentsListHeader('comments')}
        />
      </div>
    )
  }

  renderCommentsListHeader(label, tagType, score = null) {
    return (
      <div className="comments-container-header">
        <span>{this.props.t(label)} </span>
        {score !== null && <Tag type={tagType}>{score}</Tag>}
      </div>
    )
  }

  calculateScore(comments) {
    return comments.reduce((score, comment) => {
      return score + (comment.score > 0 ? comment.score : 0)
    }, 0)
  }
}
