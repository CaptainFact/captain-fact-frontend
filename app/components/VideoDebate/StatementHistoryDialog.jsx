import { useQuery, useSubscription } from '@apollo/client'
import { startCase } from 'lodash'
import { History } from 'lucide-react'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import {
  STATEMENT_HISTORY_ACTION_ADDED_SUBSCRIPTION,
  STATEMENT_HISTORY_ACTIONS_QUERY,
} from './graphql'
import { ENTITY_STATEMENT } from '../../constants'
import ActionsTable from '../UsersActions/ActionsTable'

const StatementHistoryDialog = ({ open, onOpenChange, entity, entityId }) => {
  const { t } = useTranslation('history')

  // Fetch initial history actions
  const { loading, data, error, client } = useQuery(STATEMENT_HISTORY_ACTIONS_QUERY, {
    variables: { statementId: entityId },
    skip: !entityId || entity !== ENTITY_STATEMENT || !open,
    fetchPolicy: 'cache-and-network',
  })

  // Subscribe to new actions
  useSubscription(STATEMENT_HISTORY_ACTION_ADDED_SUBSCRIPTION, {
    variables: { statementId: entityId },
    skip: !entityId || entity !== ENTITY_STATEMENT || !open,
    onData: ({ data }) => {
      if (data?.data?.statementHistoryActionAdded) {
        const newAction = data.data.statementHistoryActionAdded

        // Update the cache by adding the new action to the existing query
        client.cache.updateQuery(
          {
            query: STATEMENT_HISTORY_ACTIONS_QUERY,
            variables: { statementId: entityId },
          },
          (existingData) => {
            if (!existingData) {
              return existingData
            }

            return {
              ...existingData,
              statementHistoryActions: [newAction, ...existingData.statementHistoryActions],
            }
          },
        )
      }
    },
  })

  const renderTitle = () => (
    <div className="flex items-center gap-2">
      <History size={24} />
      <span>
        {' '}
        {startCase(t(`entities.${entity}`))} #{entityId}
      </span>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modal modal-history">
        <DialogHeader>
          <DialogTitle>{renderTitle()}</DialogTitle>
        </DialogHeader>
        <ActionsTable
          actions={data?.statementHistoryActions || []}
          isLoading={loading}
          showRestore={false}
          showEntity={false}
        />
      </DialogContent>
    </Dialog>
  )
}

StatementHistoryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  entity: PropTypes.string.isRequired,
  entityId: PropTypes.string.isRequired,
}

export { StatementHistoryDialog }
