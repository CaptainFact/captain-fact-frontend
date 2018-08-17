import React from 'react'
import Icon from '../Utils/Icon'


const ACTIONS_ICONS = [
  'plus',         // Create
  'times',        // Remove
  'pencil',       // Update
  'times',        // Delete
  'plus',         // Add
  'undo',         // Revert,
  null,           // Approved
  'flag',         // Flagged
  'chevron-up',   // Vote up
  'chevron-down', // Vote down
  'chevron-up',   // Self vote
  'chevron-down', // Revert upvote
  'chevron-up',   // Revert downvote
  'chevron-down', // Revert self vote
]

const getIconName = type => (
  (type <= ACTIONS_ICONS.length && ACTIONS_ICONS[type - 1])
  || 'question'
)

const ActionIcon = ({type}) => (
  <Icon name={getIconName(type)} size="mini"/>
)

export default ActionIcon
