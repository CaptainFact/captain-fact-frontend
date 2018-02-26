import React from 'react'
import Icon from '../Utils/Icon'


const ACTIONS_ICONS = [
  "plus",     // Create
  "times",    // Remove
  "pencil",   // Update
  "times",    // Delete
  "plus",     // Add
  "undo"      // Restore
]

const ActionIcon = ({type}) =>
  type <= ACTIONS_ICONS.length ?
    <Icon name={ACTIONS_ICONS[type - 1]} size="mini"/> :
    null

export default ActionIcon