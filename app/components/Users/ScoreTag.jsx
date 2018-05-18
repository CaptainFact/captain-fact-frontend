import React from 'react'
import Tag from '../Utils/Tag'
import { Icon } from '../Utils/Icon'


function getTagType(reputation) {
  if (reputation < 0)
    return 'danger'
  else if (reputation < 50)
    return 'warning'
  return 'success'
}

const ScoreTag = ({reputation, size = "small", withIcon = false}) =>
  <Tag type={getTagType(reputation)} size={size}>
    { withIcon && <Icon name="star" style={{marginRight: 5, color: 'yellow'}}/> }
    { reputation }
  </Tag>


export default ScoreTag
