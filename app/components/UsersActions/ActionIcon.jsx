import React from 'react'
import Icon from '../Utils/Icon'

const ACTIONS_ICONS = {
  create: 'plus',
  remove: 'times',
  update: 'pencil',
  delete: 'times',
  add: 'plus',
  revert: 'undo',
  flag: 'flag',
  vote_up: 'chevron-up',
  vote_down: 'chevron-down',
  self_vote: 'chevron-up',
  revert_vote_up: 'chevron-down',
  revert_vote_down: 'chevron-up',
  revert_self_vote: 'chevron-down'
}

const getIconName = type => ACTIONS_ICONS[type] || 'question'

const ActionIcon = ({ type }) => (
  <Icon name={getIconName(type)} size="mini" />
)

export default ActionIcon
