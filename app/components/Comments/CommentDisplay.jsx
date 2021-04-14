import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { change } from 'redux-form'
import classNames from 'classnames'

import { addModal } from '../../state/modals/reducer'
import { commentVote, deleteComment, flagComment } from '../../state/video_debate/comments/effects'
import { flashErrorUnauthenticated } from '../../state/flashes/reducer'
import MediaLayout from '../Utils/MediaLayout'
import Vote from './Vote'
import CommentActions from './CommentActions'
import CommentHeader from './CommentHeader'
import CommentContent from './CommentContent'
import { COLLAPSE_REPLIES_AT_NESTING } from '../../constants'
import ModalFlag from './ModalFlag'
import ModalDeleteComment from './ModalDeleteComment'
import { CommentsList } from './CommentsList'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

@connect(
  (state, { comment }) => ({
    myVote: state.VideoDebate.comments.voted.get(comment.id, 0),
    isVoting: state.VideoDebate.comments.voting.has(comment.id),
    replies: state.VideoDebate.comments.replies.get(comment.id),
    isFlagged: state.VideoDebate.comments.myFlags.has(comment.id),
  }),
  {
    addModal,
    deleteComment,
    flagComment,
    commentVote,
    change,
    flashErrorUnauthenticated,
  }
)
@withNamespaces('main')
@withLoggedInUser
export class CommentDisplay extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isBlurred: false,
      repliesCollapsed: props.nesting === COLLAPSE_REPLIES_AT_NESTING,
    }
  }

  render() {
    const { comment, withoutActions, className, replies, hideThread } = this.props
    const { isBlurred, repliesCollapsed } = this.state
    const approveClass = this.getApproveClass(comment.approve)
    const allClassNames = classNames('comment', className, approveClass, {
      isBlurred,
      hasSource: !!comment.source,
    })

    return (
      <div>
        <MediaLayout
          ContainerType="article"
          className={allClassNames}
          left={!withoutActions && this.renderCommentLeft()}
          content={this.renderCommentContent()}
        />
        {!hideThread && !repliesCollapsed && replies && (
          <CommentsList
            comments={this.props.replies}
            nesting={this.props.nesting + 1}
            replyingTo={this.props.comment.user}
            setReplyToComment={this.props.setReplyToComment}
          />
        )}
      </div>
    )
  }

  renderCommentLeft() {
    const { myVote, isVoting, comment } = this.props

    return (
      <Vote
        isVoting={isVoting}
        score={comment.score}
        myVote={myVote}
        onVote={this.handleVote}
        isReported={comment.is_reported}
      />
    )
  }

  renderCommentContent() {
    const { repliesCollapsed } = this.state
    const { comment, withoutActions, withoutModalSource, replies, richMedias = true } = this.props
    const isOwnComment = comment.user && this.props.loggedInUser.id === comment.user.id

    return (
      <React.Fragment>
        {!this.props.withoutHeader && (
          <CommentHeader comment={comment} withoutActions={withoutActions} />
        )}
        <CommentContent
          comment={comment}
          nesting={this.props.nesting}
          replyingTo={this.props.replyingTo}
          richMedias={richMedias}
          withoutModalSource={withoutModalSource}
        />
        {!withoutActions && (
          <CommentActions
            isOwnComment={isOwnComment}
            isFlagged={this.props.isFlagged}
            nbReplies={replies ? replies.size : 0}
            repliesCollapsed={repliesCollapsed}
            handleReply={this.handleReply}
            handleDelete={this.handleDelete}
            handleFlag={this.handleFlag}
            handleToggleShowReplies={() => this.toggleShowReplies(repliesCollapsed)}
          />
        )}
      </React.Fragment>
    )
  }

  getApproveClass(approve) {
    return approve !== null && (approve ? 'approve' : 'refute')
  }

  // ---- State modifiers ----

  setIsBlurred(isBlurred) {
    this.setState({ isBlurred })
  }

  toggleShowReplies(currentState) {
    this.setState({ repliesCollapsed: !currentState })
  }

  // ---- Authenticated actions ----

  ensureAuthenticated() {
    if (this.props.isAuthenticated) {
      return true
    }

    this.props.flashErrorUnauthenticated()
    return false
  }

  handleDelete = () => {
    this.setIsBlurred(true)
    this.props.addModal({
      Modal: ModalDeleteComment,
      props: {
        handleAbort: () => this.setIsBlurred(false),
        handleConfirm: () => this.props.deleteComment(this.props.comment),
        comment: this.props.comment,
      },
    })
  }

  handleVote = (value) => {
    if (!this.ensureAuthenticated()) {
      return false
    }
    return this.props.commentVote({ comment: this.props.comment, value })
  }

  handleReply = () => {
    if (!this.props.setReplyToComment || !this.ensureAuthenticated()) {
      return null
    }

    return this.props.setReplyToComment(this.props.comment)
  }

  handleFlag = (initialReason) => {
    if (!this.ensureAuthenticated()) {
      return
    }
    this.setIsBlurred(true)
    this.props.addModal({
      Modal: ModalFlag,
      props: {
        handleAbort: () => this.setIsBlurred(false),
        handleConfirm: ({ reason }) => {
          this.setIsBlurred(false)
          return this.props.flagComment({
            id: this.props.comment.id,
            reason: parseInt(reason),
          })
        },
        comment: this.props.comment,
        initialReason,
      },
    })
  }
}
