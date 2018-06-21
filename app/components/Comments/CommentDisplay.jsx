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
import { USER_PICTURE_SMALL, ONBOARDING_VOTE_BUTTONS, MIN_REPUTATION_FLAG } from '../../constants'
import MediaLayout from '../Utils/MediaLayout'
import Vote from './Vote'
import OnboardingStep from '../Onboarding/OnboardingStep';

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
    const isOwnComment = this.props.comment.user.id === this.props.currentUser.id

    return (
      <div>
        <MediaLayout
          className={classNames('comment', className, approveClass, {
            isBlurred: this.state.isBlurred,
            hasSource: !!source,
          })}
          ContainerType="article"
          left={!withoutActions &&
            <OnboardingStep
              uniqueId={ONBOARDING_VOTE_BUTTONS}
              titleI18n="vote_buttons.title"
              contentI18n="vote_buttons.text"
              placement="right"
              target=".vote"
            >
              <Vote
                isVoting={isVoting}
                score={this.getScore()}
                myVote={myVote}
                onVote={value => this.ensureAuthenticated() &&
                      this.props.commentVote({comment: this.props.comment, value})
                }
              />
            </OnboardingStep>
          }
          content={
            <div>
              <div>
                {!withoutHeader &&
                  <div className="comment-header">
                    <UserPicture user={user} size={USER_PICTURE_SMALL}/>
                    <UserAppellation user={user} withoutActions={withoutActions}/>
                    <span> - </span>
                    <TimeSince className="comment-time" time={inserted_at}/>
                  </div>
                }
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
                    <a className={!showReplies ? 'reply-collapsed' : null}
                       onClick={() => this.setState({showReplies: !showReplies})}>
                      <Icon size="small" name={showReplies ? 'eye-slash' : 'eye'}/>
                      <span>
                        {t('videoDebate:comment.replies', {
                          context: showReplies ? 'hide' : 'show',
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
    return (
      <React.Fragment>
        <a onClick={() => this.actionReply()}>
          <Icon name="plus"/> <span> {this.props.t('actions.addToThread')}</span>
        </a>
        <a onClick={() => this.handleDelete()}>
          <Icon name="times"/>
          <span> {this.props.t('actions.delete')}</span>
        </a>
      </React.Fragment>
    )
  }

  renderOtherCommentActions() {
    const {t, isFlagged} = this.props
    return (
      <React.Fragment>
        <a onClick={() => this.actionReply()}>
          <Icon name="reply"/> <span>{t('actions.reply')}</span>
        </a>
        <ReputationGuard requiredRep={MIN_REPUTATION_FLAG}>
          {!isFlagged &&
          <a onClick={() => this.handleFlag('3')}>
            <Icon name="ban"/>
            <span> {t('moderation:reason.3')}</span>
          </a>
          }
          <a
            onClick={() => this.handleFlag()}
            className={classNames('action-report', {selected: isFlagged})}
          >
            <Icon name="flag"/>
            <span> {t(isFlagged ? 'actions.flagged' : 'misc.otherFlags')}</span>
          </a>
        </ReputationGuard>
      </React.Fragment>
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
      return
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
