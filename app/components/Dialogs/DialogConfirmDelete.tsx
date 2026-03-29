import { CircleX, Trash } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { DialogConfirm } from './DialogConfirm'

const DialogConfirmDelete = ({
  isRemove = false,
  ...props
}: React.ComponentProps<typeof DialogConfirm> & {
  isRemove?: boolean
}) => {
  const { t } = useTranslation('main')
  return (
    <DialogConfirm
      confirmIcon={isRemove ? <Trash size="1em" /> : <CircleX size="1em" />}
      confirmText={isRemove ? t('actions.remove') : t('actions.delete')}
      abortText={t('actions.cancel')}
      {...props}
    />
  )
}

export default DialogConfirmDelete
