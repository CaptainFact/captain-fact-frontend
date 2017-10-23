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


@connect((state, props) => ({
  speaker: statementSelectors.getStatementSpeaker(state, props),
  comments: commentsSelectors.getStatementComments(state, props),
  approvingFacts : commentsSelectors.getStatementApprovingFacts(state, props),
  refutingFacts : commentsSelectors.getStatementRefutingFacts(state, props),
  approveScore: statementSelectors.getStatementApproveScore(state, props),
  refuteScore: statementSelectors.getStatementRefuteScore(state, props),
  isLoading: commentsSelectors.areCommentsLoading(state),
  isAuthenticated: isAuthenticated(state),
  isFocused: statementSelectors.isStatementFocused(state, props),
  currentUser: state.CurrentUser.data,
  scrollTo: state.VideoDebate.statements.scrollTo,
  enableAutoscroll: state.UserPreferences.enableAutoscroll,
  formEnabled: state.VideoDebate.statements.formsCount > 0
}), {addModal, updateStatement, deleteStatement, forcePosition})
@translate('videoDebate')
export class Statement extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isDeleting: false, isEditing: false }
  }

  componentDidMount() {
    if (this.props.scrollTo && this.props.scrollTo.id === this.props.statement.id)
      this.smoothScrollTo()
  }

  componentDidUpdate(prevProps) {
    if (!this.props.enableAutoscroll || this.props.formEnabled)
      return
    if (this.props.scrollTo &&
        (this.props.scrollTo !== prevProps.scrollTo || !prevProps.enableAutoscroll) &&
        this.props.scrollTo.id === this.props.statement.id)
      this.smoothScrollTo()
    else if (this.props.isFocused && !prevProps.isFocused)
      this.smoothScrollTo()
  }

  smoothScrollTo() {
    this.refs.container.scrollIntoView({behavior: 'smooth'})
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
            <TimeDisplay time={statement.time} handleClick={t => this.props.forcePosition(t)}/>
            {speaker && speaker.picture &&
              <img className="speaker-mini" src={staticResource(speaker.picture)}/>
            }
            <strong>{speaker ? speaker.full_name : ""}</strong>
          </p>
          {isAuthenticated &&
            <div className="card-header-icon">
              <LinkWithIcon iconName="history" onClick={ this.showHistory.bind(this) }/>
              <LinkWithIcon iconName="pencil" onClick={() => this.setState({isEditing: true})}/>
              <LinkWithIcon iconName="share-alt" onClick={() => this.props.addModal({
                Modal: ShareModal,
                props: {path: `${location.pathname}?statement=${statement.id}`}
              })}/>
              <LinkWithIcon iconName="times" onClick={() => this.setState({isDeleting: true})}/>
            </div>
          }
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
    if (this.props.isLoading)
      return (<LoadingFrame size="small" title="Loading comments"/>)
    const { statement, comments, approvingFacts, refutingFacts, currentUser } = this.props

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
        {(comments.size > 0 || currentUser.id !== 0) &&
          <div>
              <div className="card-footer comments">
                {comments.size > 0 &&
                  <CommentsContainer comments={comments}/>
                }
                {currentUser.id !== 0 &&
                  <CommentForm  form={`formAddComment-${statement.id}`}
                                initialValues={{ statement_id: statement.id }}/>
                  // TODO This can be optimized as initialValues will always change upon rendering
                }
              </div>
          </div>
        }
      </div>
    )
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
}
