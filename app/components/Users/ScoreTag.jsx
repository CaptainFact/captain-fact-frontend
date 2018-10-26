import React from 'react'
import Tag from '../Utils/Tag'
import { Icon } from '../Utils/Icon'


function getTagType(reputation) {
  if (reputation < 0)
    return 'danger'
  if (reputation < 50)
    return 'warning'
  return 'normal'
}

const ScoreTag = ({reputation, size = 'small', withIcon = false}) => (
  <Tag className="scoreTag" type={getTagType(reputation)} size={size}>
    { withIcon && <Icon name="star" style={{marginRight: 5, color: 'yellow'}}/> }
    { reputation }
  </Tag>
)


export default ScoreTag
