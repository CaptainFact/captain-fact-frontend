import { useMutation } from '@apollo/client'
import { Check, X } from '@styled-icons/feather'
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'
import { toastError } from '@/lib/toasts'

import { DELETE_STATEMENT_MUTATION, UPDATE_STATEMENT_MUTATION } from '../../../API/graphql_queries'
import {
  MIN_REPUTATION_REMOVE_STATEMENT,
  MIN_REPUTATION_UPDATE_STATEMENT,
} from '../../../constants'
import CommentFormV2 from '../../Comments/CommentFormV2'
import { withLoggedInUser } from '../../LoggedInUser/UserProvider'
import ModalConfirmDelete from '../../Modal/ModalConfirmDelete'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import ReputationGuardTooltip from '../../Utils/ReputationGuardTooltip'
import StatementCommentsV2 from './StatementCommentsV2'
import StatementFormV2 from './StatementFormV2'
import StatementV2 from './StatementV2'

const StatementContainerV2 = ({
  statement,
  speakers,
  offset,
  votesMap,
  onSetScrollTo,
  isAuthenticated,
  loggedInUser,
  t,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [editDraftAction, setEditDraftAction] = useState(null)

  const [deleteStatement] = useMutation(DELETE_STATEMENT_MUTATION)
  const [updateStatement] = useMutation(UPDATE_STATEMENT_MUTATION)

  const speaker = statement.speaker

  const handleUpdateStatement = async (updatedStatement) => {
    try {
      await updateStatement({
        variables: {
          id: updatedStatement.id,
          text: updatedStatement.text,
          time: updatedStatement.time,
          speakerId: updatedStatement.speakerId || null,
          isDraft: updatedStatement.isDraft || false,
        },
      })
      setIsEditing(false)
      return { id: updatedStatement.id }
    } catch (error) {
      toastError(error)
      throw error
    }
  }

  const handleDeleteStatement = async () => {
    try {
      await deleteStatement({
        variables: {
          id: statement.id,
        },
      })
      setIsDeleting(false)
    } catch (error) {
      toastError(error)
    }
  }

  const handlePublishDraft = async () => {
    setEditDraftAction('save')
    try {
      await updateStatement({
        variables: {
          id: statement.id,
          text: statement.text,
          time: statement.time,
          speakerId: statement.speakerId || null,
          isDraft: false,
        },
      })
    } catch (error) {
      toastError(error)
    } finally {
      setEditDraftAction(null)
    }
  }

  const handleDiscardDraft = async () => {
    setEditDraftAction('discard')
    try {
      await deleteStatement({
        variables: {
          id: statement.id,
        },
      })
    } catch (error) {
      toastError(error)
    } finally {
      setEditDraftAction(null)
    }
  }

  return (
    <Card
      id={`statement-${statement.id}`}
      className="max-w-[980px] mx-auto bg-white dark:bg-background"
    >
      {isEditing ? (
        <StatementFormV2
          offset={offset}
          initialValues={statement}
          speakers={speakers}
          onAbort={() => setIsEditing(false)}
          onConfirm={handleUpdateStatement}
          onSetScrollTo={onSetScrollTo}
        />
      ) : (
        <StatementV2
          statement={statement}
          speaker={speaker}
          handleEdit={() => setIsEditing(true)}
          handleDelete={() => setIsDeleting(true)}
          offset={offset}
          onSetScrollTo={onSetScrollTo}
        />
      )}

      {statement.isDraft && !isEditing ? (
        <footer className="flex border-t border-gray-200 dark:border-border">
          <ReputationGuardTooltip requiredRep={MIN_REPUTATION_UPDATE_STATEMENT} asChild>
            {({ hasReputation }) => (
              <Button
                variant="ghost"
                className="flex-1 rounded-none border-r border-gray-200 dark:border-border"
                disabled={!hasReputation || editDraftAction}
                onClick={handlePublishDraft}
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
                disabled={!hasReputation || editDraftAction}
                onClick={handleDiscardDraft}
              >
                <X size={16} className="mr-1" />
                {t('statement.discard')}
              </Button>
            )}
          </ReputationGuardTooltip>
        </footer>
      ) : (
        <React.Fragment>
          <StatementCommentsV2
            statement={statement}
            speaker={speaker}
            setReplyToComment={setReplyTo}
            votesMap={votesMap}
          />
          {!statement.isDraft && (
            <CommentFormV2
              statementID={statement.id}
              replyTo={replyTo}
              setReplyToComment={setReplyTo}
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
          handleAbort={() => setIsDeleting(false)}
          handleConfirm={handleDeleteStatement}
        />
      )}
    </Card>
  )
}

export default withTranslation('videoDebate')(withLoggedInUser(StatementContainerV2))
