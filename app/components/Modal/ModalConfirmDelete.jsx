import React from "react"

import { ModalConfirm } from "./ModalConfirm"
import { translate } from 'react-i18next'


const ModalConfirmDelete = ({t, isRemove=false, ...props}) => (
  <ModalConfirm
    confirmIcon={isRemove ? "trash" : "times"}
    confirmText={isRemove ? t('actions.remove') : t('actions.delete')}
    abortIcon="ban"
    abortText={t('actions.cancel')}
    {...props}
  />
)

export default translate('main')(ModalConfirmDelete)