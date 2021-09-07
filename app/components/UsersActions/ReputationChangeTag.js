import React from 'react'
import Tag from '../Utils/Tag'
import { Icon } from '../Utils/Icon'
import { withNamespaces } from 'react-i18next'

function getTagType(reputation) {
  if (reputation < 0) {
    return 'dark'
  } else {
    return 'success'
  }
}

const ReputationChangeTag = ({ t, reputation, size = 'small', withIcon = false }) => (
  <Tag className="scoreTag" type={getTagType(reputation)} size={size} title={t('reputationChange')}>
    {withIcon && <Icon name="star" style={{ marginRight: 5, color: 'yellow' }} />}
    {reputation > 0 && '+'}
    {reputation}
  </Tag>
)

export default withNamespaces('user')(ReputationChangeTag)
