import { CircleX, Trash } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { ModalConfirm } from './ModalConfirm'

const ModalConfirmDelete = ({ t, isRemove = false, open, onOpenChange, ...props }) => {
  // If open and onOpenChange are provided, use controlled mode
  if (open !== undefined && onOpenChange) {
    return (
      <ModalConfirm
        confirmIcon={isRemove ? <Trash size="1em" /> : <CircleX size="1em" />}
        confirmText={isRemove ? t('actions.remove') : t('actions.delete')}
        abortText={t('actions.cancel')}
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      />
    )
  }

  // Otherwise, use the legacy Redux modal system
  return (
    <ModalConfirm
      confirmIcon={isRemove ? <Trash size="1em" /> : <CircleX size="1em" />}
      confirmText={isRemove ? t('actions.remove') : t('actions.delete')}
      abortText={t('actions.cancel')}
      {...props}
    />
  )
}

export default withTranslation('main')(ModalConfirmDelete)
