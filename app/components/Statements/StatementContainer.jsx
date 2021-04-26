import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import IntersectionVisible from 'react-intersection-visible'

import { StatementForm } from './StatementForm'
import ModalConfirmDelete from '../Modal/ModalConfirmDelete'

import * as statementSelectors from '../../state/video_debate/statements/selectors'
import { deleteStatement, updateStatement } from '../../state/video_debate/statements/effects'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import StatementComments from './StatementComments'
import CommentForm from '../Comments/CommentForm'
import Statement from './Statement'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

@connect(
  (state, props) => ({
    offset: state.VideoDebate.video.offset,
    speaker: statementSelectors.getStatementSpeaker(state, props),
    isFocused: statementSelectors.isStatementFocused(state, props),
    scrollTo: state.VideoDebate.statements.scrollTo,
    formEnabled: state.VideoDebate.statements.formsCount > 0,
  }),
  { updateStatement, deleteStatement }
)
@withLoggedInUser
@withNamespaces('videoDebate')
export default class StatementContainer extends React.PureComponent {
  state = { isDeleting: false, isEditing: false, replyTo: null }

  componentDidUpdate(prevProps) {
    if (this.shouldScroll(this.props, prevProps)) {
      this.smoothScrollTo()
    }
  }

  setReplyToComment = (replyTo) => {
    this.setState({ replyTo })
  }

  render() {
    const { isDeleting, replyTo } = this.state
    const {
      statement,
      isFocused,
      speaker,
      isAuthenticated,
      loggedInUser,
      t,
      autoscrollEnabled,
      toggleAutoscroll,
    } = this.props

    return (
      <IntersectionVisible
        onShow={() => {
          if (isFocused && !autoscrollEnabled) {
            toggleAutoscroll()
          }
        }}
        onHide={() => {
          if (isFocused && autoscrollEnabled) {
            toggleAutoscroll()
          }
        }}
      >
        <div
          className={classNames('statement-container', { 'is-focused': isFocused })}
          ref="container"
        >
          <div className="card statement">
            {this.renderStatementOrEditForm(speaker, statement)}
            <StatementComments
              statement={statement}
              speaker={speaker}
              setReplyToComment={this.setReplyToComment}
            />
            <CommentForm
              statementID={statement.id}
              replyTo={replyTo}
              setReplyToComment={this.setReplyToComment}
              user={isAuthenticated ? loggedInUser : null}
            />
            {isDeleting && (
              <ModalConfirmDelete
                title={t('statement.remove')}
                className="is-small"
                isAbsolute
                isRemove
                message={t('statement.confirmRemove')}
                handleAbort={() => this.setState({ isDeleting: false })}
                handleConfirm={() => this.props.deleteStatement({ id: statement.id })}
              />
            )}
          </div>
        </div>
      </IntersectionVisible>
    )
  }

  renderStatementOrEditForm(speaker, statement) {
    return this.state.isEditing ? (
      <StatementForm
        form={`StatementForm-${statement.id}`}
        initialValues={statement.toJS()}
        offset={this.props.offset}
        isBundled
        handleAbort={() => this.setState({ isEditing: false })}
        handleConfirm={(s) =>
          this.props.updateStatement(s).then(
            handleFormEffectResponse({
              onSuccess: (response) => {
                this.setState({ isEditing: false })
                return response
              },
            })
          )
        }
      />
    ) : (
      <Statement
        statement={statement}
        speaker={speaker}
        handleEdit={() => this.setState({ isEditing: true })}
        handleDelete={() => this.setState({ isDeleting: true })}
        offset={this.props.offset}
      />
    )
  }

  // ---- Autoscroll ----

  shouldScroll = (props, prevProps) => {
    // Return if not ready or if this is not the scroll target and not focused
    if (!this.isAutoScrollReady(props) || !this.isTarget(props)) {
      return false
    }

    // Prevent unwanted autoscroll on autoscrollEnabled toggle
    if (!props.scrollToFocusedStatement) {
      return false
    }

    // Get previous state
    const wasEnabled = prevProps.autoscrollEnabled
    const wasTarget = this.isTarget(prevProps)
    const wasReady = this.isAutoScrollReady(prevProps)
    const wasActive = wasTarget && wasReady && wasEnabled
    const wasForced = this.isAutoScrollForced(props)

    // Scroll if enabled and wasn't target, wasn't enabled or wasn't ready
    if (props.autoscrollEnabled && !wasActive) {
      return true
    }

    // Only override autoscrollEnabled when we're forced by a scrollTo
    if (!props.autoscrollEnabled && (!wasActive || !wasForced) && this.isAutoScrollForced(props)) {
      return true
    }

    return false
  }

  isAutoScrollReady = (props) => !props.commentsLoading && !props.formEnabled

  isScrollToTarget = (props) => {
    return props.scrollTo && props.scrollTo.id === props.statement.id
  }

  isAutoScrollForced = (props) => {
    return this.isScrollToTarget(props) && props.scrollTo.__forceAutoScroll
  }

  isTarget = (props) => this.isScrollToTarget(props) || props.isFocused

  smoothScrollTo = () => {
    return this.refs.container.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
}
