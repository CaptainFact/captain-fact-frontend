import React from 'react'
import { translate } from 'react-i18next'

import { Icon } from '../Utils/Icon'


const IconModerationPending = ({t}) => (
  <Icon
    className="reported"
    name="ban"
    title={t('pending')}
  />
)

export default translate('moderation')(IconModerationPending)
