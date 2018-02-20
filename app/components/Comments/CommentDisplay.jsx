import React from "react"
import { connect } from "react-redux"
import { change } from 'redux-form'
import { List } from "immutable"
import classNames from 'classnames'

import { TimeSince } from "../Utils"
import { Icon } from "../Utils"
import { Source } from "./Source"
import UserAppellation from "../Users/UserAppellation"
import ModalFlag from './ModalFlag'
import ModalDeleteComment from './ModalDeleteComment'
import { translate } from 'react-i18next'
import { CommentsContainer } from './CommentsContainer'
import Tag from '../Utils/Tag'
import { addModal } from '../../state/modals/reducer'
import { commentVote, deleteComment, flagComment } from '../../state/video_debate/comments/effects'
import {flashErrorUnauthenticated} from '../../state/flashes/reducer'
import UserPicture from '../Users/UserPicture'
import { USER_PICTURE_SMALL } from '../../constants'
import MediaLayout from '../Utils/MediaLayout'
import Vote from './Vote'


// TODO Use ReputationGuard to protect actions
// Add the following possibilities to reputationGuard :
// onUnauthorized = "hide" | "showMessage" | "flash"

@connect(({CurrentUser, VideoDebate}, props) => ({
  currentUser: CurrentUser.data,
  myVote: VideoDebate.comments.voted.get(props.comment.id, 0),
  isVoting: VideoDebate.comments.voting.has(props.comment.id),
  replies: VideoDebate.comments.replies.get(props.comment.id),
  isFlagged: VideoDebate.comments.myFlags.has(props.comment.id) // TODO Selector
}), {addModal, deleteComment, flagComment, commentVote, change, flashErrorUnauthenticated})
@translate(['main', 'videoDebate'])
export class CommentDisplay extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {isBlurred: false, showReplies: props.nesting !== 4}
    this.showRepliesToggle = this.showRepliesToggle.bind(this)

    // Authenticated actions
    this.actionReply = this.actionAuthenticated(this.actionReply.bind(this))
    this.handleFlag = this.actionAuthenticated(this.handleFlag.bind(this))
  }

  render() {
    const { user, text, source, score, inserted_at, approve } = this.props.comment
    const { t, withoutActions, withoutHeader, replyingTo, nesting, replies, myVote, isVoting, hideThread, className, richMedias=true } = this.props
    const approveClass = approve !== null && (approve ? 'approve' : 'refute')
    const isOwnComment = this.props.comment.user.id === this.props.currentUser.id

    return (
      <div>
        <MediaLayout
          className={classNames('comment', className, approveClass, {isBlurred: this.state.isBlurred, hasSource: !!source})}
          ContainerType="article"
          left={!withoutActions &&
            <Vote isVoting={isVoting} score={score} myVote={myVote}
                  onVote={value => this.props.commentVote({comment: this.props.comment, value})}/>
          }
          content={
            <div>
              <div>
                {!withoutHeader && <div className="comment-header">
                  <UserPicture user={user} size={USER_PICTURE_SMALL}/>
                  <UserAppellation user={user} withoutActions={withoutActions}/>
                  <span> - </span>
                  <TimeSince className="comment-time" time={inserted_at}/>
                </div>}
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
              {!withoutActions &&
                <nav className="comment-actions">
                  { isOwnComment ? this.renderOwnCommentActions() : this.renderOtherCommentActions()}
                  { replies &&
                    <a onClick={this.showRepliesToggle}>
                      <Icon size="small" name={this.state.showReplies ? "eye-slash" : "eye"}/>
                      <span>
                        {t('videoDebate:comment.replies', {
                          context: this.state.showReplies ? 'hide' : 'show',
                          count: replies.size
                        })}
                      </span>
                    </a>
                  }
                </nav>
              }
            </div>
          }
        />
        {!hideThread && replies &&
        <CommentsContainer comments={this.state.showReplies ? replies : new List()}
                           nesting={nesting + 1}
                           replyingTo={user}/>
        }
      </div>
    )
  }

  renderOwnCommentActions() {
    return [
      <a key="r" onClick={this.actionReply}>
        <Icon name="plus"/>
        <span> {this.props.t('actions.addToThread')}</span>
      </a>,
      <a key="d" onClick={this.handleDelete.bind(this)}>
        <Icon name="times"/>
        <span> {this.props.t('actions.delete')}</span>
      </a>
    ]
  }

  renderOtherCommentActions() {
    return [
      <a key="r" onClick={this.actionReply}>
        <Icon name="reply"/>
        <span> {this.props.t('actions.reply')}</span>
      </a>,
      <a key="f" onClick={this.handleFlag}
         className={classNames('action-report', {selected: this.props.isFlagged})}>
        <Icon name="flag"/>
        <span> {this.props.t(this.props.isFlagged ? 'actions.flagged' : 'actions.flag')}</span>
      </a>
    ]
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

  handleFlag() {
    this.setState({isBlurred: true})
    this.props.addModal({
      Modal: ModalFlag,
      props: {
        handleAbort: () => this.setState({isBlurred: false}),
        handleConfirm: ({reason}) => {
          this.setState({isBlurred: false})
          return this.props.flagComment({id: this.props.comment.id, reason: parseInt(reason)})
        },
        comment: this.props.comment
      }
    })
  }

  actionAuthenticated(func) {
    return args => {
      if (!this.props.currentUser.id)
        this.props.flashErrorUnauthenticated()
      else
        func(args)
    }
  }

  showRepliesToggle() {
    this.setState({showReplies: !this.state.showReplies})
  }

  actionReply() {
    const formName = `formAddComment-${this.props.comment.statement_id}`
    this.props.change(formName, 'reply_to', this.props.comment)
  }
}
