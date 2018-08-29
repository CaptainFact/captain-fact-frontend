import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { CommentsList } from '../Comments'

import { classifyComments } from '../../state/video_debate/comments/selectors'
import Tag from '../Utils/Tag'
import VerificationsOriginHeader from './VerificationsOriginHeader'
import SpeakerComments from './SpeakerComments'


@translate('videoDebate')
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
    const {speaker, speakerComments} = this.props
    return (
      <React.Fragment>
        <SpeakerComments speaker={speaker} comments={speakerComments}/>
        {this.renderCommunityComments()}
      </React.Fragment>
    )
  }

  renderCommunityComments() {
    const {t, approvingFacts, refutingFacts, comments} = this.props
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
    const {approvingFacts, refutingFacts} = this.props

    return (
      <div className="card-footer sourced-comments">
        {refutingFacts.size > 0 && (
          <CommentsList
            className="card-footer-item refute"
            comments={refutingFacts}
            header={this.renderCommentsListHeader('refute', 'danger', this.calculateScore(refutingFacts))}
          />
        )}
        {approvingFacts.size > 0 && (
          <CommentsList
            className="card-footer-item approve"
            comments={approvingFacts}
            header={this.renderCommentsListHeader('approve', 'success', this.calculateScore(approvingFacts))}
          />
        )}
      </div>
    )
  }

  renderRegularComments() {
    const { comments } = this.props

    return (
      <div className="card-footer comments">
        <CommentsList
          comments={comments}
          header={this.renderCommentsListHeader('comments')}
        />
      </div>
    )
  }

  renderCommentsListHeader(label, tagType, score = null) {
    return (
      <div className="comments-container-header">
        <span>{this.props.t(label)} </span>
        {score !== null && <Tag type={tagType}>{ score }</Tag>}
      </div>
    )
  }

  calculateScore(comments) {
    return comments.reduce((score, comment) => {
      return score + (comment.score > 0 ? comment.score : 0)
    }, 0)
  }
}
