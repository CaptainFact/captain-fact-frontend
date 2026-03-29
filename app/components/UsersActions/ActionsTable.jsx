import { useMutation } from '@apollo/client'
import { Indent, Undo } from 'lucide-react'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { RESTORE_SPEAKER_MUTATION, RESTORE_STATEMENT_MUTATION } from '../../API/graphql_queries'
import { ACTION_DELETE, ACTION_REMOVE, ENTITY_SPEAKER, ENTITY_STATEMENT } from '../../constants'
import { getEntityIDFromAction } from '../../lib/user_action_entity_id'
import { Button } from '../ui/button'
import UserAppellation from '../Users/UserAppellation'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { TimeSince } from '../Utils/TimeSince'
import ActionDiff from './ActionDiff'
import ActionEntityLink from './ActionEntityLink'
import ActionIcon from './ActionIcon'

const ActionsTable = ({ actions, isLoading, showEntity = true }) => {
  const { t } = useTranslation('history')
  const [expandedDiffs, setExpandedDiffs] = useState([])

  const [restoreStatement] = useMutation(RESTORE_STATEMENT_MUTATION)
  const [restoreSpeaker] = useMutation(RESTORE_SPEAKER_MUTATION)

  // Compute which actions are the last ones for their entities
  const lastActionIds = useMemo(() => {
    const lastActionsMap = {}

    actions.forEach((action) => {
      const entityKey = `${action.entity}:${getEntityIDFromAction(action)}`
      const existingAction = lastActionsMap[entityKey]

      // Keep the action with the most recent time
      if (!existingAction || action.time > existingAction.time) {
        lastActionsMap[entityKey] = action
      }
    })

    return new Set(Object.values(lastActionsMap).map((action) => action.id))
  }, [actions])

  const getNbCols = () => 7 - !showEntity

  const handleRestore = async (action) => {
    try {
      if (action.entity === ENTITY_STATEMENT) {
        await restoreStatement({
          variables: { id: action.statementId || action.id },
        })
      } else if (action.entity === ENTITY_SPEAKER) {
        await restoreSpeaker({
          variables: {
            speakerId: action.speakerId || action.id,
            videoId: action.videoId,
          },
        })
      }
    } catch {
      // Error handling could be added here
    }
  }

  const toggleDiff = (action, isDiffing) => {
    if (isDiffing) {
      setExpandedDiffs((prev) => prev.filter((id) => id !== action.id))
    } else {
      setExpandedDiffs((prev) => [...prev, action.id])
    }
  }

  const renderActionLine = (action, isDiffing = false) => {
    const isLastActionForEntity = lastActionIds.has(action.id)
    const isReversibleType = [ACTION_DELETE, ACTION_REMOVE].includes(action.type)
    const reversible = isLastActionForEntity && isReversibleType

    return (
      <TableRow key={action.id}>
        <TableCell>
          <TimeSince time={action.time} />
        </TableCell>
        <TableCell>
          <UserAppellation user={action.user} compact />
        </TableCell>
        <TableCell>
          <ActionIcon className="inline" type={action.type} />
          <strong> {t(`action.${action.type}`)}</strong>
        </TableCell>
        {showEntity && (
          <TableCell>
            <ActionEntityLink action={action} />
          </TableCell>
        )}
        <TableCell>
          <Button variant="outline" size="xs" onClick={() => toggleDiff(action, isDiffing)}>
            <Indent size="1em" />
            <span>{t(isDiffing ? 'compare_hide' : 'compare_show')} </span>
          </Button>
          {reversible && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleRestore(action)}
              className="ml-2"
            >
              <Undo size="1em" />
              <span>{t('revert')}</span>
            </Button>
          )}
        </TableCell>
      </TableRow>
    )
  }

  const renderDiffLine = (action) => (
    <TableRow key={`${action.id}-diff`}>
      <TableCell colSpan={getNbCols()} style={{ padding: 0 }}>
        <ActionDiff action={action} allActions={actions} />
      </TableCell>
    </TableRow>
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('when')}</TableHead>
          <TableHead>{t('who')}</TableHead>
          <TableHead>Action</TableHead>
          {showEntity && <TableHead>{t('entity')}</TableHead>}
          <TableHead>{t('main:actions.all')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow style={{ background: 'none' }}>
            <TableCell colSpan={getNbCols()}>
              <LoadingFrame />
            </TableCell>
          </TableRow>
        ) : (
          actions.map((action) => {
            if (expandedDiffs.includes(action.id)) {
              return [renderActionLine(action, true), renderDiffLine(action)]
            }
            return renderActionLine(action)
          })
        )}
      </TableBody>
    </Table>
  )
}

ActionsTable.propTypes = {
  actions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  showEntity: PropTypes.bool,
}

ActionsTable.defaultProps = {
  isLoading: false,
  showEntity: true,
}

export default ActionsTable
