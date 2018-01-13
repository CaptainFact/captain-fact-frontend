import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import { staticResource } from "../../API"
import { LoadingFrame, LinkWithIcon } from "../Utils"
import TimeDisplay from '../Utils/TimeDisplay'
import { StatementForm } from "./StatementForm"
import { CommentForm, CommentsContainer } from "../Comments"
import ModalConfirmDelete from "../Modal/ModalConfirmDelete"

import * as statementSelectors from "../../state/video_debate/statements/selectors"
import * as commentsSelectors from "../../state/video_debate/comments/selectors"
import { isAuthenticated } from '../../state/users/current_user/selectors'
import { ModalHistory } from '../VideoDebate/ModalHistory'
import Tag from '../Utils/Tag'
import { addModal } from '../../state/modals/reducer'
import { deleteStatement, updateStatement } from '../../state/video_debate/statements/effects'
import { forcePosition } from '../../state/video_debate/video/reducer'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import ShareModal from '../Utils/ShareModal'
import {ENTITY_STATEMENT} from '../../constants'
import { setScrollTo } from '../../state/video_debate/statements/reducer'


@connect((state, props) => ({
  speaker: statementSelectors.getStatementSpeaker(state, props),
  comments: commentsSelectors.getStatementComments(state, props),
  approvingFacts : commentsSelectors.getStatementApprovingFacts(state, props),
  refutingFacts : commentsSelectors.getStatementRefutingFacts(state, props),
  approveScore: statementSelectors.getStatementApproveScore(state, props),
  refuteScore: statementSelectors.getStatementRefuteScore(state, props),
  commentsLoading: commentsSelectors.areCommentsLoading(state),
  isAuthenticated: isAuthenticated(state),
  isFocused: statementSelectors.isStatementFocused(state, props),
  currentUser: state.CurrentUser.data,
  scrollTo: state.VideoDebate.statements.scrollTo,
  autoscrollEnabled: state.UserPreferences.enableAutoscroll,
  formEnabled: state.VideoDebate.statements.formsCount > 0
}), {addModal, updateStatement, deleteStatement, forcePosition, setScrollTo})
@translate('videoDebate')
export class Statement extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isDeleting: false, isEditing: false }
  }

  componentDidUpdate(prevProps) {
    if (this.shouldScroll(this.props, prevProps))
      this.smoothScrollTo()
  }

  render() {
    const { isDeleting } = this.state
    const { statement, isFocused, isAuthenticated, speaker } = this.props

    return (
      <div className={`statement-container${isFocused ? ' is-focused' : ''}`} ref="container">
        <div className="card statement">
          {this.renderCardHeaderAndContent(isAuthenticated, speaker, statement)}
          {this.renderFactsAndComments()}
          {isDeleting &&
          <ModalConfirmDelete
            title="Remove Statement"
            isAbsolute={true}
            isRemove={true}
            message="Do you really want to remove this statement ?"
            handleAbort={() => this.setState({isDeleting: false})}
            handleConfirm={() => this.props.deleteStatement({id: statement.id})}
          />
          }
        </div>
      </div>
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

  renderCardHeaderAndContent(isAuthenticated, speaker, statement) {
    if (this.state.isEditing) return (
      <StatementForm
        form={`StatementForm-${statement.id}`}
        initialValues={statement.toJS()}
        isBundled={true}
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
            <TimeDisplay time={statement.time} handleClick={t => {
              this.props.forcePosition(t)
              this.props.setScrollTo({id: statement.id, __forceAutoScroll: true})
            }}/>
            {speaker && speaker.picture &&
            <img className="speaker-mini" src={staticResource(speaker.picture)}/>
            }
            <strong>{speaker ? speaker.full_name : ""}</strong>
          </p>

          <div className="card-header-icon">
            <LinkWithIcon iconName="history" onClick={ this.showHistory.bind(this) }/>
            {isAuthenticated && <LinkWithIcon iconName="pencil" onClick={() => this.setState({isEditing: true})}/>}
            <LinkWithIcon iconName="share-alt" onClick={() => this.props.addModal({
              Modal: ShareModal,
              props: {path: `${location.pathname}?statement=${statement.id}`}
            })}/>
            {isAuthenticated && <LinkWithIcon iconName="times" onClick={() => this.setState({isDeleting: true})}/>}
          </div>
        </header>
        <div className="card-content statement-text-container">
          <div className="statement-text">
            {statement.text}
          </div>
        </div>
      </div>
    )
  }

  renderCommentsContainerHeader(label, tagType, score) {
    return <span>{this.props.t(label)} <Tag type={tagType}>{ score }</Tag></span>
  }

  renderFactsAndComments() {
    if (this.props.commentsLoading)
      return (<LoadingFrame size="small" title="Loading comments"/>)
    const { statement, comments, approvingFacts, refutingFacts, currentUser, isAuthenticated } = this.props

    return (
      <div>
        {(approvingFacts.size > 0 || refutingFacts.size > 0) &&
        <div className="card-footer facts">
          {approvingFacts.size > 0 &&
          <CommentsContainer className="card-footer-item approve"
                             comments={approvingFacts}
                             header={this.renderCommentsContainerHeader('approve', 'success', this.props.approveScore)}/>
          }
          {refutingFacts.size > 0 &&
          <CommentsContainer className="card-footer-item refute"
                             comments={refutingFacts}
                             header={this.renderCommentsContainerHeader('refute', 'danger', this.props.refuteScore)}/>
          }
        </div>
        }
        <div className="card-footer comments">
          {comments.size > 0 && <CommentsContainer comments={comments}/>}
          {/* TODO This can be optimized as initialValues will always change upon rendering */}
          <CommentForm form={`formAddComment-${statement.id}`} initialValues={{ statement_id: statement.id }}/>
        </div>
      </div>
    )
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
