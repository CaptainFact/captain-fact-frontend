import { startCase } from 'lodash'
import { History } from 'lucide-react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { ENTITY_STATEMENT } from '../../constants'
import { reset } from '../../state/user_actions/reducer'
import {
  joinStatementHistoryChannel,
  leaveStatementHistoryChannel,
} from '../../state/video_debate/history/effects'
import ActionsTable from '../UsersActions/ActionsTable'

const ModalHistory = ({ open, onOpenChange, entity, entityId }) => {
  const { t } = useTranslation('history')
  const dispatch = useDispatch()
  const actions = useSelector((state) => state.UsersActions.actions)
  const isLoading = useSelector((state) => state.UsersActions.isLoading)

  useEffect(() => {
    if (open && entity === ENTITY_STATEMENT) {
      dispatch(joinStatementHistoryChannel(entityId))
    }
    return () => {
      if (entity === ENTITY_STATEMENT) {
        dispatch(leaveStatementHistoryChannel())
      }
      dispatch(reset())
    }
  }, [open, entity, entityId, dispatch])

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
          actions={actions}
          isLoading={isLoading}
          showRestore={false}
          showEntity={false}
        />
      </DialogContent>
    </Dialog>
  )
}

export { ModalHistory }
export default ModalHistory
