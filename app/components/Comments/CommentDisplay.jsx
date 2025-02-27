import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { change } from 'redux-form'

import { cn } from '@/lib/css-utils'
import { toastErrorUnauthenticated } from '@/lib/toasts'

import { COLLAPSE_REPLIES_AT_NESTING } from '../../constants'
import { addModal } from '../../state/modals/reducer'
import { commentVote, deleteComment, flagComment } from '../../state/video_debate/comments/effects'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import CommentActions from './CommentActions'
import CommentContent from './CommentContent'
import CommentHeader from './CommentHeader'
import { CommentsList } from './CommentsList'
import ModalDeleteComment from './ModalDeleteComment'
import ModalFlag from './ModalFlag'
import Vote from './Vote'

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
  },
)
@withTranslation('main')
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
    const { comment, withoutActions, replies, hideThread, isQuoted } = this.props
    const { isBlurred, repliesCollapsed } = this.state
    const approveClass = this.getApproveClass(comment.approve)
    const allClassNames = cn({
      'opacity-50 blur-sm': isBlurred,
      'border-l': this.props.nesting > 1,
      'border-green-500': approveClass === 'approve',
      'border-red-500': approveClass === 'refute',
      'bg-neutral-100 border-gray-500': isQuoted,
    })

    return (
      <div className={allClassNames}>
        <article className={'flex gap-4 p-4'}>
          {!withoutActions && <div className="flex-shrink-0">{this.renderCommentLeft()}</div>}
          <div className="flex-grow min-w-0">{this.renderCommentContent()}</div>
        </article>
        {!hideThread && !repliesCollapsed && replies && (
          <div className="ml-7">
            <CommentsList
              comments={this.props.replies}
              nesting={this.props.nesting + 1}
              replyingTo={this.props.comment.user}
              setReplyToComment={this.props.setReplyToComment}
            />
          </div>
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
    const { comment, withoutActions, replies, richMedias = true } = this.props
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

    toastErrorUnauthenticated()
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

  handleFlag = () => {
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
      },
    })
  }
}
