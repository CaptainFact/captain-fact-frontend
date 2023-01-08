import React from 'react'
import { withNamespaces } from 'react-i18next'

import { Icon } from '../Utils/Icon'
import Tag from '../Utils/Tag'

function getTagType(reputation) {
  if (reputation < 0) {
    return 'danger'
  }
  if (reputation < 50) {
    return 'warning'
  }
  return 'success'
}

const ScoreTag = ({ t, reputation, size = 'small', withIcon = false }) => (
  <Tag className="scoreTag" type={getTagType(reputation)} size={size} title={t('reputation')}>
    {withIcon && <Icon name="star" style={{ marginRight: 5, color: 'yellow' }} />}
    {reputation}
  </Tag>
)

export default withNamespaces('user')(ScoreTag)
