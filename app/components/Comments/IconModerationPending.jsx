import React from 'react'
import { withNamespaces } from 'react-i18next'

import { Icon } from '../Utils/Icon'

const IconModerationPending = ({ t }) => (
  <Icon className="reported" name="ban" title={t('pending')} />
)

export default withNamespaces('moderation')(IconModerationPending)
