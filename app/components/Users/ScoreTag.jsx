import React from 'react'
import Tag from '../Utils/Tag'
import { Icon } from '../Utils/Icon'
import { withNamespaces } from 'react-i18next'

function getTagType(reputation) {
  if (reputation < 0) return 'danger'
  if (reputation < 50) return 'warning'
  return 'success'
}

const ScoreTag = ({ t, reputation, size = 'small', withIcon = false }) => (
  <Tag
    className="scoreTag"
    type={getTagType(reputation)}
    size={size}
    title={t('reputation')}
  >
    {withIcon && <Icon name="star" style={{ marginRight: 5, color: 'yellow' }} />}
    {reputation}
  </Tag>
)

export default withNamespaces('user')(ScoreTag)
