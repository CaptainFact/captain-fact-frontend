import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import { staticResource } from "../../API"
import { LoadingFrame, LinkWithIcon } from "../Utils"
import ReputationGuard from '../Utils/ReputationGuard'
import TimeDisplay from '../Utils/TimeDisplay'
import { StatementForm } from "./StatementForm"
import { CommentForm, CommentsContainer } from "../Comments"
import ModalConfirmDelete from "../Modal/ModalConfirmDelete"

import * as statementSelectors from "../../state/video_debate/statements/selectors"
import * as commentsSelectors from "../../state/video_debate/comments/selectors"
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


@connect((state, props) => ({
  speaker: statementSelectors.getStatementSpeaker(state, props),
  comments: commentsSelectors.getStatementComments(state, props),
  approvingFacts : commentsSelectors.getStatementApprovingFacts(state, props),
  refutingFacts : commentsSelectors.getStatementRefutingFacts(state, props),
  approveScore: statementSelectors.getStatementApproveScore(state, props),
  refuteScore: statementSelectors.getStatementRefuteScore(state, props),
  isFocused: statementSelectors.isStatementFocused(state, props),
  currentUser: state.CurrentUser.data,
  scrollTo: state.VideoDebate.statements.scrollTo,
  autoscrollEnabled: state.UserPreferences.enableAutoscroll,
  formEnabled: state.VideoDebate.statements.formsCount > 0
}), {addModal, updateStatement, deleteStatement, forcePosition, setScrollTo})
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
            isAbsolute={true}
            isRemove={true}
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
              forcePosition(t)
              setScrollTo({id: statement.id, __forceAutoScroll: true})
            }}/>
            {speaker && speaker.picture &&
            <img className="speaker-mini" src={speaker.picture}/>
            }
            <strong>{speaker ? speaker.full_name : ""}</strong>
          </p>

          <div className="card-header-icon">
            <LinkWithIcon iconName="history" title={t('history')} onClick={ () => this.showHistory() }/>
            <ReputationGuard requiredRep={MIN_REPUTATION_UPDATE_STATEMENT}>
              <LinkWithIcon iconName="pencil"
                            title={t('main:actions.edit')}
                            onClick={() => this.setState({isEditing: true})}/>
            </ReputationGuard>
            <LinkWithIcon iconName="share-alt" title={t('main:actions.share')} onClick={() => addModal({
              Modal: ShareModal,
              props: {path: `${location.pathname}?statement=${statement.id}`}
            })}/>
            <ReputationGuard requiredRep={MIN_REPUTATION_REMOVE_STATEMENT}>
              <LinkWithIcon iconName="times"
                            title={t('main:actions.remove')}
                            onClick={() => this.setState({isDeleting: true})}/>
            </ReputationGuard>
          </div>
        </header>
        <div className="card-content statement-text-container">
          <h3 className="statement-text">{statement.text}</h3>
        </div>
      </div>
    )
  }

  renderCommentsContainerHeader(label, tagType, score) {
    return <span>{this.props.t(label)} <Tag type={tagType}>{ score }</Tag></span>
  }

  renderFactsAndComments() {
    const { statement, comments, approvingFacts, refutingFacts } = this.props

    return (
      <div>
        {(approvingFacts.size > 0 || refutingFacts.size > 0) &&
        <div className="card-footer facts">
          {refutingFacts.size > 0 &&
          <CommentsContainer className="card-footer-item refute"
                             comments={refutingFacts}
                             header={this.renderCommentsContainerHeader('refute', 'danger', this.props.refuteScore)}/>
          }
          {approvingFacts.size > 0 &&
          <CommentsContainer className="card-footer-item approve"
                             comments={approvingFacts}
                             header={this.renderCommentsContainerHeader('approve', 'success', this.props.approveScore)}/>
          }
        </div>
        }
        <div className="card-footer comments">
          {comments.size > 0 && <CommentsContainer comments={comments}/>}
          <CommentForm form={`formAddComment-${statement.id}`}
                       initialValues={{ statement_id: statement.id }}/>
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
