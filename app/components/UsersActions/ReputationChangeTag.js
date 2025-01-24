import { Star } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { Badge } from '../ui/badge'

function getTagType(reputation) {
  if (reputation < 0) {
    return 'destructive'
  } else {
    return 'success'
  }
}

const ReputationChangeTag = ({ t, reputation, size = 'small', withIcon = false }) => (
  <Badge variant={getTagType(reputation)} size={size} title={t('reputationChange')}>
    {withIcon && <Star size="1em" className="mr-1" />}
    {reputation > 0 && '+'}
    {reputation}
  </Badge>
)

export default withTranslation('user')(ReputationChangeTag)
