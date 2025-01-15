import { Check, X } from '@styled-icons/feather'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { cn } from '@/lib/css-utils'

import { MIN_REPUTATION_REMOVE_STATEMENT, MIN_REPUTATION_UPDATE_STATEMENT } from '../../constants'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import { deleteStatement, updateStatement } from '../../state/video_debate/statements/effects'
import * as statementSelectors from '../../state/video_debate/statements/selectors'
import CommentForm from '../Comments/CommentForm'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import ModalConfirmDelete from '../Modal/ModalConfirmDelete'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'
import Statement from './Statement'
import StatementComments from './StatementComments'
import { StatementForm } from './StatementForm'

@connect(
  (state, props) => ({
    offset: state.VideoDebate.video.offset,
    speaker: statementSelectors.getStatementSpeaker(state, props),
    isFocused: statementSelectors.isStatementFocused(state, props),
    scrollTo: state.VideoDebate.statements.scrollTo,
    autoscrollEnabled: state.UserPreferences.enableAutoscroll,
    formEnabled: state.VideoDebate.statements.formsCount > 0,
  }),
  { updateStatement, deleteStatement },
)
@withLoggedInUser
@withTranslation('videoDebate')
export default class StatementContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isDeleting: false, isEditing: false, replyTo: null, editDraftAction: null }
    this.containerRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.shouldScroll(this.props, prevProps)) {
      this.smoothScrollTo()
    }
  }

  setReplyToComment = (replyTo) => {
    this.setState({ replyTo })
  }

  render() {
    const { isDeleting, isEditing, replyTo } = this.state
    const { statement, isFocused, speaker, isAuthenticated, loggedInUser, t } = this.props

    return (
      <Card
        ref={this.containerRef}
        className={cn('max-w-[980px] mx-auto bg-white', { 'shadow-lg': isFocused })}
      >
        {this.renderStatementOrEditForm(speaker, statement)}
        {statement.is_draft && !isEditing ? (
          <footer className="flex border-t border-gray-200">
            <ReputationGuardTooltip requiredRep={MIN_REPUTATION_UPDATE_STATEMENT} asChild>
              {({ hasReputation }) => (
                <Button
                  variant="ghost"
                  className="flex-1 rounded-none border-r border-gray-200"
                  disabled={Boolean(!hasReputation || this.state.editDraftAction)}
                  onClick={async () => {
                    this.setState({ editDraftAction: 'save' })
                    try {
                      await this.props.updateStatement(statement.set('is_draft', false))
                    } finally {
                      this.setState({ editDraftAction: null })
                    }
                  }}
                >
                  <Check size={16} className="mr-1" />
                  {t('statement.publish')}
                </Button>
              )}
            </ReputationGuardTooltip>
            <ReputationGuardTooltip requiredRep={MIN_REPUTATION_REMOVE_STATEMENT} asChild>
              {({ hasReputation }) => (
                <Button
                  variant="ghost"
                  className="flex-1 rounded-none"
                  disabled={Boolean(!hasReputation || this.state.editDraftAction)}
                  onClick={async () => {
                    this.setState({ editDraftAction: 'discard' })
                    try {
                      await this.props.deleteStatement({ id: statement.id })
                    } finally {
                      this.setState({ editDraftAction: null })
                    }
                  }}
                >
                  <X size={16} className="mr-1" />
                  {t('statement.discard')}
                </Button>
              )}
            </ReputationGuardTooltip>
          </footer>
        ) : (
          <React.Fragment>
            <StatementComments
              statement={statement}
              speaker={speaker}
              setReplyToComment={this.setReplyToComment}
            />
            {!statement.is_draft && (
              <CommentForm
                statementID={statement.id}
                replyTo={replyTo}
                setReplyToComment={this.setReplyToComment}
                user={isAuthenticated ? loggedInUser : null}
              />
            )}
          </React.Fragment>
        )}
        {isDeleting && (
          <ModalConfirmDelete
            title={t('statement.remove')}
            className="text-sm"
            isAbsolute
            isRemove
            message={t('statement.confirmRemove')}
            handleAbort={() => this.setState({ isDeleting: false })}
            handleConfirm={() => this.props.deleteStatement({ id: statement.id })}
          />
        )}
      </Card>
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
            }),
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
    if (this.containerRef.current) {
      return this.containerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }
}
