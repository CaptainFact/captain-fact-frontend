import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import ClickableIcon from '../Utils/ClickableIcon'
import Icon from '../Utils/Icon'
import ReputationGuard from '../Utils/ReputationGuard'
import TimeDisplay from '../Utils/TimeDisplay'
import { StatementForm } from './StatementForm'
import { CommentForm, CommentsContainer } from '../Comments'
import ModalConfirmDelete from '../Modal/ModalConfirmDelete'

import * as statementSelectors from '../../state/video_debate/statements/selectors'
import { classifyComments } from '../../state/video_debate/comments/selectors'
import { ModalHistory } from '../VideoDebate/ModalHistory'
import Tag from '../Utils/Tag'
import { addModal } from '../../state/modals/reducer'
import { deleteStatement, updateStatement } from '../../state/video_debate/statements/effects'
import { forcePosition } from '../../state/video_debate/video/reducer'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import ShareModal from '../Utils/ShareModal'
import {
  ENTITY_STATEMENT, MIN_REPUTATION_REMOVE_STATEMENT,
  MIN_REPUTATION_UPDATE_STATEMENT
} from '../../constants'
import { setScrollTo } from '../../state/video_debate/statements/reducer'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'


@connect((state, props) => {
  const classifiedComments = classifyComments(state, props)
  return {
    speaker: statementSelectors.getStatementSpeaker(state, props),
    comments: classifiedComments.regularComments,
    selfComments: classifiedComments.selfComments,
    approvingFacts: classifiedComments.approvingFacts,
    refutingFacts: classifiedComments.refutingFacts,
    isFocused: statementSelectors.isStatementFocused(state, props),
    currentUser: state.CurrentUser.data,
    scrollTo: state.VideoDebate.statements.scrollTo,
    autoscrollEnabled: state.UserPreferences.enableAutoscroll,
    formEnabled: state.VideoDebate.statements.formsCount > 0
  }
}, {addModal, updateStatement, deleteStatement, forcePosition, setScrollTo})
@translate('videoDebate')
export class Statement extends React.PureComponent {
  state = { isDeleting: false, isEditing: false }

  componentDidUpdate(prevProps) {
    if (this.shouldScroll(this.props, prevProps))
      this.smoothScrollTo()
  }

  render() {
    const { isDeleting } = this.state
    const { statement, isFocused, speaker, t } = this.props

    return (
      <div className={`statement-container${isFocused ? ' is-focused' : ''}`} ref="container">
        <div className="card statement">
          {this.renderCardHeaderAndContent(speaker, statement)}
          {this.renderFactsAndComments()}
          {isDeleting &&
          <ModalConfirmDelete
            title={t('statement.remove')}
            className="is-small"
            isAbsolute
            isRemove
            message={t('statement.confirmRemove')}
            handleAbort={() => this.setState({isDeleting: false})}
            handleConfirm={() => this.props.deleteStatement({id: statement.id})}
          />
          }
        </div>
      </div>
    )
  }

  renderCardHeaderAndContent(speaker, statement) {
    const {t, forcePosition, setScrollTo, addModal} = this.props

    if (this.state.isEditing) return (
      <StatementForm
        form={`StatementForm-${statement.id}`}
        initialValues={statement.toJS()}
        isBundled
        handleAbort={() => this.setState({isEditing: false})}
        handleConfirm={s => this.props.updateStatement(s)
          .then(handleFormEffectResponse({
            onSuccess: response => {
              this.setState({isEditing: false})
              return response
            }
          }))
        }
      />
    )
    return (
      <div>
        <header className="card-header">
          <p className="card-header-title">
            <TimeDisplay
              time={statement.time}
              handleClick={t => {
                forcePosition(t)
                setScrollTo({id: statement.id, __forceAutoScroll: true})
              }}
            />
            {speaker && speaker.picture &&
            <img className="speaker-mini" src={speaker.picture}/>
            }
            <strong>{speaker ? speaker.full_name : ''}</strong>
          </p>

          <div className="card-header-icon">
            <ClickableIcon
              name="history"
              size="action-size"
              title={t('history')}
              onClick={() => this.showHistory()}
            />
            <ReputationGuard requiredRep={MIN_REPUTATION_UPDATE_STATEMENT}>
              <ClickableIcon
                name="pencil"
                size="action-size"
                title={t('main:actions.edit')}
                onClick={() => this.setState({isEditing: true})}
              />
            </ReputationGuard>
            <ClickableIcon
              name="share-alt"
              size="action-size"
              title={t('main:actions.share')}
              onClick={() => addModal({
                Modal: ShareModal,
                props: {path: `${location.pathname}?statement=${statement.id}`}
              })}
            />
            <ReputationGuard requiredRep={MIN_REPUTATION_REMOVE_STATEMENT}>
              <ClickableIcon
                name="times"
                size="action-size"
                title={t('main:actions.remove')}
                onClick={() => this.setState({isDeleting: true})}
              />
            </ReputationGuard>
          </div>
        </header>
        <div className="card-content statement-text-container">
          <h3 className="statement-text">{statement.text}</h3>
        </div>
      </div>
    )
  }

  renderCommentsContainerHeader(label, tagType, score = null) {
    return (
      <div className="comments-container-header">
        <span>{this.props.t(label)} </span>
        {score !== null && <Tag type={tagType}>{ score }</Tag>}
      </div>
    )
  }

  renderFactsAndComments() {
    const { statement, comments, approvingFacts, refutingFacts, speaker, selfComments, t } = this.props

    return (
      <div>
        {selfComments.size > 0 &&
          <div className="card-footer self-comments columns is-gapless">
            <div className="column is-narrow">
              <div className="sourcesType">
                <Icon name="user"/> {t('speaker.one')}
              </div>
              <SpeakerPreview speaker={speaker} withoutActions/>
            </div>
            <div className="column">
              <CommentsContainer comments={selfComments}/>
            </div>
          </div>
        }
        {(approvingFacts.size > 0 || refutingFacts.size > 0 || comments.size > 0) &&
          <div className="sourcesType">
            <Icon name="users"/> {t('community')}
          </div>
        }
        {(approvingFacts.size > 0 || refutingFacts.size > 0) &&
        <div className="card-footer sourced-comments">
          {refutingFacts.size > 0 &&
          <CommentsContainer
            className="card-footer-item refute"
            comments={refutingFacts}
            header={this.renderCommentsContainerHeader('refute', 'danger', this.calculateScore(refutingFacts))}
          />
          }
          {approvingFacts.size > 0 &&
          <CommentsContainer
            className="card-footer-item approve"
            comments={approvingFacts}
            header={this.renderCommentsContainerHeader('approve', 'success', this.calculateScore(approvingFacts))}
          />
          }
        </div>
        }
        <div className="card-footer comments">
          {comments.size > 0 &&
            <CommentsContainer
              comments={comments}
              header={this.renderCommentsContainerHeader('comments')}
            />
          }
          <CommentForm
            form={`formAddComment-${statement.id}`}
            initialValues={{ statement_id: statement.id }}
          />
        </div>
      </div>
    )
  }

  calculateScore(comments) {
    return comments.reduce((score, comment) =>
      score + (comment.score > 0 ? comment.score : 0), 0
    )
  }

  showHistory() {
    this.props.addModal({
      Modal: ModalHistory,
      props: {
        entity: ENTITY_STATEMENT,
        entityId: this.props.statement.id
      }
    })
  }

  // ---- Autoscroll ----

  shouldScroll = (props, prevProps) => {
    // Return if not ready or if this is not the scroll target and not focused
    if (!this.isAutoScrollReady(props) || !this.isTarget(props))
      return false

    // Get previous state
    const wasEnabled = prevProps.autoscrollEnabled
    const wasTarget = this.isTarget(prevProps)
    const wasReady = this.isAutoScrollReady(prevProps)
    const wasActive = wasTarget && wasReady && wasEnabled
    const wasForced = this.isAutoScrollForced(props)

    // Scroll if enabled and wasn't target, wasn't enabled or wasn't ready
    if (props.autoscrollEnabled && !wasActive)
      return true

    // Only override autoscrollEnabled when we're forced by a scrollTo
    else if (!props.autoscrollEnabled && (!wasActive || !wasForced) && this.isAutoScrollForced(props))
      return true

    return false
  }

  isAutoScrollReady = props => !props.commentsLoading && !props.formEnabled
  isScrollToTarget = props => props.scrollTo && props.scrollTo.id === props.statement.id
  isAutoScrollForced = props => this.isScrollToTarget(props) && props.scrollTo.__forceAutoScroll
  isTarget = props => this.isScrollToTarget(props) || props.isFocused
  smoothScrollTo = () => this.refs.container.scrollIntoView({behavior: 'smooth'})
}
