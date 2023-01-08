import React from 'react'
import { withNamespaces } from 'react-i18next'

import { ModalConfirm } from './ModalConfirm'

const ModalConfirmDelete = ({ t, isRemove = false, ...props }) => (
  <ModalConfirm
    confirmIcon={isRemove ? 'trash-o' : 'times'}
    confirmText={isRemove ? t('actions.remove') : t('actions.delete')}
    abortIcon="ban"
    abortText={t('actions.cancel')}
    {...props}
  />
)

export default withNamespaces('main')(ModalConfirmDelete)
