import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { change } from 'redux-form'
import { List } from 'immutable'
import classNames from 'classnames'

import { TimeSince, Icon } from '../Utils'
import ReputationGuard from '../Utils/ReputationGuard'
import { Source } from './Source'
import UserAppellation from '../Users/UserAppellation'
import ModalFlag from './ModalFlag'
import ModalDeleteComment from './ModalDeleteComment'
import { CommentsContainer } from './CommentsContainer'
import Tag from '../Utils/Tag'
import { addModal } from '../../state/modals/reducer'
import { commentVote, deleteComment, flagComment } from '../../state/video_debate/comments/effects'
import {flashErrorUnauthenticated} from '../../state/flashes/reducer'
import UserPicture from '../Users/UserPicture'
import { MIN_REPUTATION_FLAG, USER_PICTURE_SMALL } from '../../constants'
import MediaLayout from '../Utils/MediaLayout'
import Vote from './Vote'
import Button from '../Utils/Button'


@connect(({CurrentUser, VideoDebate}, props) => ({
  currentUser: CurrentUser.data,
  myVote: VideoDebate.comments.voted.get(props.comment.id, 0),
  isVoting: VideoDebate.comments.voting.has(props.comment.id),
  replies: VideoDebate.comments.replies.get(props.comment.id),
  isFlagged: VideoDebate.comments.myFlags.has(props.comment.id)
}), {addModal, deleteComment, flagComment, commentVote, change, flashErrorUnauthenticated})
@translate('main')
export class CommentDisplay extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {isBlurred: false, showReplies: props.nesting !== 4}
  }

  render() {
    const { user, text, source, inserted_at, approve } = this.props.comment
    const { t, withoutActions, withoutHeader, replyingTo, nesting, replies, myVote, isVoting, hideThread, className, richMedias = true } = this.props
    const approveClass = approve !== null && (approve ? 'approve' : 'refute')
    const showReplies = this.state.showReplies
    const isOwnComment = user && user.id === this.props.currentUser.id

    return (
      <div>
        <MediaLayout
          className={classNames('comment', className, approveClass, {
            isBlurred: this.state.isBlurred,
            hasSource: !!source,
          })}
          ContainerType="article"
          left={!withoutActions &&
            <Vote
              isVoting={isVoting}
              score={this.getScore()}
              myVote={myVote}
              onVote={value => this.ensureAuthenticated() &&
                    this.props.commentVote({comment: this.props.comment, value})
              }
            />
          }
          content={(
            <div>
              <div>
                {!withoutHeader && (
                  <div className="comment-header">
                    {this.renderUserHeader(user, withoutActions)}
                    <span> - </span>
                    <TimeSince className="comment-time" time={inserted_at}/>
                  </div>
                )}
                {(text || (replyingTo && nesting > 6)) &&
                <div className="comment-text">
                  {(replyingTo && nesting > 6) &&
                  <Tag style={{marginRight: 5}}>@{replyingTo.username}</Tag>
                  }
                  { text }
                </div>
                }
                {source && <Source withoutPlayer={!richMedias} source={source}/>}
              </div>
              {!withoutActions && (
                <nav className="comment-actions">
                  { isOwnComment
                    ? this.renderOwnCommentActions()
                    : this.renderOtherCommentActions()
                  }
                  {replies && this.renderActionReply(showReplies, replies)}
                </nav>
              )}
            </div>
          )}
        />
        {!hideThread && replies &&
        <CommentsContainer comments={this.state.showReplies ? replies : new List()}
                           nesting={nesting + 1}
                           replyingTo={user}/>
        }
      </div>
    )
  }

  renderActionReply(showReplies, replies) {
    const i18nParams = {
      context: showReplies ? 'hide' : 'show',
      count: replies.size
    }

    return this.renderAction(
      this.props.t('videoDebate:comment.replies', i18nParams),
      showReplies ? 'eye-slash' : 'eye',
      () => this.setState({showReplies: !showReplies}),
      {'reply-collapsed': !showReplies},
    )
  }

  renderOwnCommentActions() {
    const {t} = this.props
    return (
      <React.Fragment>
        {this.renderAction(t('actions.addToThread'), 'plus', () => this.actionReply())}
        {this.renderAction(t('actions.delete'), 'times', () => this.handleDelete())}
      </React.Fragment>
    )
  }

  renderOtherCommentActions() {
    const {isFlagged, t} = this.props
    return (
      <React.Fragment>
        {this.renderAction(t('actions.reply'), 'reply', () => this.actionReply())}
        <ReputationGuard requiredRep={MIN_REPUTATION_FLAG}>
          {this.renderAction(
            isFlagged ? t('actions.flagged') : t('misc.flags'),
            'flag',
            () => this.handleFlag(),
            classNames('action-report', {selected: isFlagged})
          )}
        </ReputationGuard>
      </React.Fragment>
    )
  }

  renderAction(title, iconName, onClick, className = null) {
    return (
      <Button
        className={classNames('is-inverted is-primary', className)}
        onClick={onClick}
      >
        <Icon name={iconName}/>
        <span>{title}</span>
      </Button>
    )
  }

  renderUserHeader(user, withoutActions) {
    return user ? (
      <span>
        <UserPicture user={user} size={USER_PICTURE_SMALL}/>
        <UserAppellation user={user} withoutActions={withoutActions}/>
      </span>
    ) : (
      <span className="anonymous">
        {this.props.t('anonymous')}
      </span>
    )
  }

  getScore() {
    if (this.props.comment.is_reported)
      return <Icon className="reported" name="ban" title={this.props.t('moderation:pending')}/>
    return this.props.comment.score
  }

  handleDelete() {
    this.setState({isBlurred: true})
    this.props.addModal({
      Modal: ModalDeleteComment,
      props: {
        handleAbort: () => this.setState({isBlurred: false}),
        handleConfirm: () => this.props.deleteComment(this.props.comment),
        comment: this.props.comment
      }
    })
  }

  // ---- Authenticated actions ----

  ensureAuthenticated() {
    if (!this.props.currentUser.id) {
      this.props.flashErrorUnauthenticated()
      return false
    }
    return true
  }

  actionReply() {
    if (!this.ensureAuthenticated())
      return null
    const formName = `formAddComment-${this.props.comment.statement_id}`
    this.props.change(formName, 'reply_to', this.props.comment)
  }

  handleFlag(initialReason) {
    if (!this.ensureAuthenticated())
      return
    this.setState({isBlurred: true})
    this.props.addModal({
      Modal: ModalFlag,
      props: {
        handleAbort: () => this.setState({isBlurred: false}),
        handleConfirm: ({reason}) => {
          this.setState({isBlurred: false})
          return this.props.flagComment({id: this.props.comment.id, reason: parseInt(reason)})
        },
        comment: this.props.comment,
        initialReason
      }
    })
  }
}
